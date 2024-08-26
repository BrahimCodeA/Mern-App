import "./Hero.css";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-container">
        <div>
          <h1 className="hero-titre">
            Votre plateforme pour{" "}
            <span className="hero-span">partager et découvrir </span>
            des cours de{" "}
            <span className="hero-span"> programmation professionnels </span>
            gratuitement.
          </h1>
          <div>
            <p className="hero-text">
              Bienvenue sur ProfDev. Ici, vous pouvez publier vos propres cours
              et découvrir ceux d'autres personnes. Tous nos cours sont
              soigneusement sélectionnés et approuvés par notre équipe pour vous
              garantir une formation de haute qualité.
            </p>
          </div>
        </div>
        <div className="hero-groupe-btn">
          <Link to="/cours">
            <button className="hero-btn">Découvrir les cours</button>
          </Link>
          <Link to="/contact">
            <button className="hero-btn2">
              Nous contacter <FaUser style={{ marginLeft: "5px" }} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
