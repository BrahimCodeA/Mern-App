import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa6";
import { useState } from "react";
import Alert from "../../components/Alert/Alert.jsx";
import Oauth from "../../components/OAuth/Oauth.jsx";
import { FaUser } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Veuillez remplir tous les champs");
    }
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (response.ok) {
        setSuccessMessage("Compte créé avec succès");
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage("Une erreur est survenue");
    }
  };

  return (
    <div className="form-body">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form-titre">Inscription</h1>
        <label htmlFor="email">Nom utilisateur</label>
        <div className="username-signup-container">
          <span>
            <FaUserPen className="user-signup-icon" />
          </span>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="ElonMusk"
            onChange={handleChange}
            required
          />
        </div>
        <label htmlFor="email">Adresse mail</label>
        <div className="email-signup-container">
          <span>
            <FaUser className="email-signup-icon" />
          </span>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="email@gmail.com"
            onChange={handleChange}
            required
          />
        </div>
        <label htmlFor="password">Mot de passe</label>
        <div className="password-signup-container">
          <span
            className="password-signup-icon"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            placeholder="**************"
            onChange={handleChange}
            required
          />
        </div>
        <Link to="/sign-in" className="form-link">
          Déja un compte ? <span className="form-span">Connectez-vous</span>
        </Link>
        <button className="form-btn" type="submit">
          Créer un compte
          <FaUserPlus className="form-icon" />
        </button>
        <Oauth />
        {successMessage && <Alert type="success" message={successMessage} />}
        {errorMessage && <p className="form-error">{errorMessage}</p>}
      </form>
    </div>
  );
}
