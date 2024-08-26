import "./Profile.css";
import { useSelector } from "react-redux";
import { FiTool } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { IoImagesSharp } from "react-icons/io5";
import { MdDeleteSweep } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";
import ProfileLinks from "../../components/ProfileLinks/ProfileLinks";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Vous ne pouvez pas télécharger une image de plus de 2 Mo"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Aucun changement n'a été effectué");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Veuillez attendre que l'image soit téléchargée");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Vos informations ont été mises à jour");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setIsModalOpen(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
        navigate("/");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <ProfileLinks />
      <div className="container-profile">
        <form onSubmit={handleSubmit} className="form-profile">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            style={{ display: "none" }}
          />
          <div className="profile-img-container">
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt="user"
              className="profile-img"
              onClick={() => filePickerRef.current.click()}
            />
            <h6 className="profile-img-titre">
              <span
                className="clickable-text"
                onClick={() => filePickerRef.current.click()}
              >
                Modifiez image <IoImagesSharp style={{ marginLeft: "5px" }} />
              </span>
            </h6>
          </div>
          {imageFileUploading && (
            <p className="profile-progress">
              Téléchargement en cours: {imageFileUploadProgress}%
            </p>
          )}
          {imageFileUploadError && (
            <p className="profile-error">{imageFileUploadError}</p>
          )}
          <label className="profile-label">Changez le nom d'utilisateur</label>
          <input
            className="profile-input"
            type="text"
            id="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
            required
          />
          <label className="profile-label">Changez l'adresse email</label>
          <input
            className="profile-input"
            type="email"
            id="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
            required
          />
          <label className="profile-label">Changez le mot de passe</label>
          <input
            className="profile-input"
            type="password"
            id="password"
            placeholder="************"
            onChange={handleChange}
          />
          <button className="profile-btn" type="submit">
            Modifier les informations <FiTool style={{ marginLeft: "5px" }} />
          </button>

          {updateUserSuccess && (
            <p className="profile-success">{updateUserSuccess}</p>
          )}
          {updateUserError && (
            <p className="profile-error">{updateUserError}</p>
          )}
          <div className="profile-btn-delete">
            <span onClick={toggleModal} className="delete-btn-profile">
              Supprimer le compte{" "}
              <MdDeleteSweep style={{ fontSize: "20px", marginLeft: "5px" }} />
            </span>
            <span className="logout-btn-profile" onClick={handleSignout}>
              Se déconnecter{" "}
              <RiLogoutCircleLine
                style={{ fontSize: "20px", marginLeft: "5px" }}
              />
            </span>
          </div>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <p className="modal-message">
                  Êtes-vous sûr de vouloir supprimer votre compte ? Cette action
                  est irréversible.
                </p>
                <div className="modal-btns">
                  <button className="modal-btn-cancel" onClick={toggleModal}>
                    Annuler
                  </button>
                  <button
                    className="modal-btn-confirm"
                    onClick={handleDeleteUser}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
