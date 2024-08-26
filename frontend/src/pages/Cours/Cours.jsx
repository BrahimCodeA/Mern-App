/* eslint-disable react/no-unescaped-entities */
import "./Cours.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { IoAddCircle } from "react-icons/io5";
import { FaRegFaceSmileWink } from "react-icons/fa6";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import Posts from "../../components/Posts/Posts";
import jsLogo from "../../assets/img/js.png";
import reactLogo from "../../assets/img/react.png";
import nodeLogo from "../../assets/img/node.png";
import pythonLogo from "../../assets/img/python.png";
import djangoLogo from "../../assets/img/django.png";
import rubyLogo from "../../assets/img/ruby.png";

export default function Cours() {
  const { currentUser } = useSelector((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUploadImage = () => {
    if (!file) {
      setImageUploadError("Sélectionnez une image");
      return;
    }
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Erreur lors de l'envoi de l'image");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          setFormData({ ...formData, image: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      setImageUploadProgress(null);
      setImageUploadError(null);
      setFormData({});
      toggleModal();
    } catch (error) {
      setPublishError("Erreur lors de la publication du cours");
    }
  };

  return (
    <>
      <div className="container-btn">
        <div className="search-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="search"
              placeholder="Quel cours cherchez-vous ?"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {currentUser ? (
          <Link
            to="/cours"
            className="create-product-btn"
            onClick={toggleModal}
          >
            <IoAddCircle className="create-icon" /> Ajouter
          </Link>
        ) : (
          <Link to="/sign-in" className="create-product-btn">
            <IoAddCircle className="create-icon" /> Ajouter
          </Link>
        )}
      </div>
      <div className="sidebar-container">
        <nav className="sidebar">
          <ul className="sidebar-link">
            <div className="sidebar-first">
              <li
                className={`sidebar-links ${
                  selectedCategory === "javascript" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("javascript")}
              >
                JavaScript
                <img
                  src={jsLogo}
                  alt="JavaScript Logo"
                  className="sidebar-img"
                />
              </li>
              <li
                className={`sidebar-links ${
                  selectedCategory === "react" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("react")}
              >
                React
                <img src={reactLogo} alt="React Logo" className="sidebar-img" />
              </li>
              <li
                className={`sidebar-links ${
                  selectedCategory === "node-js" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("node-js")}
              >
                Node.js
                <img
                  src={nodeLogo}
                  alt="Node.js Logo"
                  className="sidebar-img"
                />
              </li>
            </div>
            <div className="sidebar-second">
              <li
                className={`sidebar-links ${
                  selectedCategory === "python" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("python")}
              >
                Python
                <img
                  src={pythonLogo}
                  alt="Python Logo"
                  className="sidebar-img"
                />
              </li>
              <li
                className={`sidebar-links ${
                  selectedCategory === "django" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("django")}
              >
                Django
                <img
                  src={djangoLogo}
                  alt="Django Logo"
                  className="sidebar-img"
                />
              </li>
              <li
                className={`sidebar-links ${
                  selectedCategory === "ruby" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("ruby")}
              >
                Ruby
                <img src={rubyLogo} alt="Ruby Logo" className="sidebar-img" />
              </li>
            </div>
          </ul>
        </nav>
      </div>
      <Posts category={selectedCategory} searchTerm={searchTerm} />
      {isModalOpen && (
        <div className="modal-cours-container">
          <div className="modal">
            <form className="modal-cours-form" onSubmit={handleSubmit}>
              <h4 className="modal-cours-titre">
                Après avoir créé votre cours, veuillez rafraîchir la page pour
                le voir s'afficher.
                <FaRegFaceSmileWink
                  style={{ marginLeft: "5px", fontSize: "20px" }}
                />
              </h4>
              <input
                type="text"
                placeholder="Ajoutez un titre"
                className="modal-cours-input"
                required
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <div className="modal-cours-file-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="modal-cours-file"
                  required
                />
                <button
                  type="button"
                  className="modal-btn-file"
                  onClick={handleUploadImage}
                  disabled={imageUploadProgress}
                >
                  Ajoutez l'image
                </button>
              </div>
              {imageUploadProgress && (
                <p className="modal-progress">
                  Téléchargement en cours: {imageUploadProgress}%
                </p>
              )}
              {imageUploadError && (
                <p className="modal-error">{imageUploadError}</p>
              )}
              {formData.image && (
                <img src={formData.image} alt="image" className="modal-img" />
              )}
              <select
                className="modal-cours-select"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                <option value="">Choisissez une catégorie</option>
                <option value="javascript">JavaScript</option>
                <option value="react">React</option>
                <option value="node-js">Node.js</option>
                <option value="python">Python</option>
                <option value="django">Django</option>
                <option value="ruby">Ruby</option>
              </select>
              <textarea
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Ajoutez une description"
                className="modal-cours-textarea"
                required
              ></textarea>
              <button type="submit" className="modal-cours-btn">
                Créer le cours
              </button>
              <button
                type="button"
                className="modal-cours-btn-delete"
                onClick={toggleModal}
              >
                Annuler
              </button>
              {publishError && <p className="modal-error">{publishError}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
