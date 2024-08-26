import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { CiLogin } from "react-icons/ci";
import { useState, useEffect } from "react";
import Alert from "../../components/Alert/Alert.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  resetMessages,
} from "../../redux/user/userSlice.js";
import Oauth from "../../components/OAuth/Oauth.jsx";
import { FaUser } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { successMessage, error: errorMessage } = useSelector(
    (state) => state.user
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetMessages());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Veuillez remplir tous les champs"));
    }
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (response.ok) {
        dispatch(signInSuccess(data));
        setTimeout(() => {
          navigate("/cours");
        }, 1000);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="form-body">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form-titre">Connexion</h1>
        <label htmlFor="email">Adresse mail</label>
        <div className="input-container">
          <span>
            <FaUser className="email-icon" />
          </span>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="email@gmail.com"
            required
            onChange={handleChange}
          />
        </div>
        <label htmlFor="password">Mot de passe</label>
        <div className="input-container">
          <span className="password-icon" onClick={togglePasswordVisibility}>
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            placeholder="*************"
            required
            onChange={handleChange}
          />
        </div>
        <Link to="/sign-up" className="form-link">
          Pas de compte ? <span className="form-span">Inscrivez-vous</span>
        </Link>
        <button className="form-btn" type="submit">
          Se connecter{" "}
          <CiLogin
            style={{ fontSize: "20px", color: "white", marginLeft: "5px" }}
          />
        </button>
        <Oauth />
        {successMessage && <Alert type="success" message={successMessage} />}
        {errorMessage && <p className="form-error">{errorMessage}</p>}
      </form>
    </div>
  );
}
