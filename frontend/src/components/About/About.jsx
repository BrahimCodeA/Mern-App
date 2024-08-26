import "./About.css";
import React_image from "../../assets/img/react.png";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="about-us">
      <div className="about-left">
        <h2 className="about-us-title">Qui sommes-nous ?</h2>
        <p className="about-us-text">
          Bienvenue sur notre plateforme, un lieu dédié à la communauté des
          développeurs passionnés. Notre mission est de créer un espace où les
          développeurs peuvent partager leurs connaissances en créant des cours
          gratuits, et où chacun peut apprendre librement à son propre rythme.
          Nous croyons fermement que le savoir doit être accessible à tous,
          c'est pourquoi nous avons créé cet environnement collaboratif.
          Rejoignez-nous et contribuez à bâtir une communauté forte et
          solidaire, où l'apprentissage et le partage sont au cœur de notre
          mission.
        </p>
        <Link to="/sign-in">
          <button className="btn-joinus">Rejoingnez-nous</button>
        </Link>
      </div>
      <div className="about-right">
        <img src={React_image} alt="Code" className="about-us-img" />
      </div>
      <div>
        <img src={React_image} alt="Code" className="about-us-img2" />
      </div>
      <div>
        <img src={React_image} alt="Code" className="about-us-img3" />
      </div>
      <div>
        <img src={React_image} alt="Code" className="about-us-img4" />
      </div>
    </section>
  );
}
