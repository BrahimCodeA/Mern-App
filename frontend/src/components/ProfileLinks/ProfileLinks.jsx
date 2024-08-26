import "./ProfileLinks.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";

export default function ProfileLinks() {
  const { pathname } = useLocation();

  return (
    <div className="user-post-links">
      <Link
        to="/profile"
        className={pathname === "/profile" ? "profile-active" : ""}
      >
        Mon Profile <FaUser className="links-icon" />
      </Link>
      <Link
        to="/profile-cours"
        className={pathname === "/profile-cours" ? "profile-active" : ""}
      >
        Mes Cours <FaUserGraduate className="links-icon" />
      </Link>
    </div>
  );
}
