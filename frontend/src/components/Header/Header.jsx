import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import { LuShoppingBag } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { CiMenuFries } from "react-icons/ci";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoMdContacts } from "react-icons/io";
import { useSelector } from "react-redux";
import { SlLogout } from "react-icons/sl";
import { AiFillExperiment } from "react-icons/ai";
import { signoutSuccess } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
    <nav className="navbar">
      <div className="container">
        <span className="links-active">
          <Link to="/">ProfDev</Link>
        </span>
        <ul
          className={`nav-links ${isMenuOpen ? "nav-links active" : ""}`}
          onClick={toggleMenu}
        >
          <div className="menu" style={{ fontSize: "24px", color: "white" }}>
            {!isMenuOpen ? <CiMenuFries /> : <IoMdClose />}
          </div>
          <li className="links">
            <Link className={pathname === "/" ? "active" : ""} to="/">
              Accueil
            </Link>
          </li>
          <li className="links">
            <Link className={pathname === "/cours" ? "active" : ""} to="/cours">
              Cours <AiFillExperiment style={{ marginLeft: "5px" }} />
            </Link>
          </li>
          <li className="links">
            <Link
              className={pathname === "/contact" ? "active" : ""}
              to="/contact"
            >
              Contact <IoMdContacts style={{ marginLeft: "5px" }} />
            </Link>
          </li>
          {currentUser ? (
            <>
              <li className="links">
                <Link
                  className={
                    pathname === "/profile" || pathname === "/profile-cours"
                      ? "actived"
                      : ""
                  }
                  to="/profile"
                >
                  <button className="btn-profile">
                    Mon compte{" "}
                    <img
                      className="img-profile"
                      src={currentUser.profilePicture}
                      alt=""
                    />
                  </button>
                </Link>
              </li>
              <li className="links">
                <Link to="/logout">
                  <button className="btn-logout" onClick={handleSignout}>
                    Déconnexion <SlLogout style={{ marginLeft: "5px" }} />
                  </button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="links">
                <Link to="/sign-in">
                  <button className="btn-signin">
                    Me connecter <FaUser style={{ marginLeft: "5px" }} />
                  </button>
                </Link>
              </li>
              <li className="links">
                <Link to="/sign-up">
                  <button className="btn-signup">
                    Créer un compte <FaUserPlus style={{ marginLeft: "5px" }} />
                  </button>
                </Link>
              </li>
            </>
          )}

          <li className="links">
            <Link to="/panier" className="cart-link">
              <LuShoppingBag style={{ fontSize: "24px" }} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
