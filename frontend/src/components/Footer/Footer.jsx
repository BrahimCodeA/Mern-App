import "./Footer.css";
import { LuMessagesSquare } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { TbBrandTiktok } from "react-icons/tb";
import { FaFacebook } from "react-icons/fa6";
import Robot from "../../assets/img/robot.jpg";

export default function Footer() {
  const newYear = new Date().getFullYear();
  return (
    <div className="footer">
      <footer>
        <span className="footer-titre">ProfDev</span>
        <div className="container-footer">
          <div className="footer-left">
            <h2 className="footer-sous-titre">
              Rejoignez la communauté ProfDev{" "}
              <LuMessagesSquare style={{ marginLeft: "5px" }} />
            </h2>
            <ul className="footer-list">
              <li className="footer-icon">
                <FaInstagram />
              </li>
              <li className="footer-icon">
                <TbBrandTiktok />
              </li>
              <li className="footer-icon">
                <FaFacebook />
              </li>
            </ul>
            <p className="copyright">
              © Développé par Ibrahim Daoudi - {newYear}
            </p>
          </div>
          <div className="footer-right">
            <img id="robot" src={Robot} alt="Robot" />
          </div>
        </div>
      </footer>
    </div>
  );
}
