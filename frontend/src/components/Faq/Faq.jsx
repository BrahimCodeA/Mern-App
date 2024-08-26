import React, { useState } from "react";
import "./Faq.css";
import { FaChevronUp } from "react-icons/fa";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Comment puis-je m'inscrire sur le site ?",
      answer:
        "Vous pouvez vous inscrire en cliquant sur le bouton 'S'inscrire' en haut de la page et en remplissant le formulaire d'inscription.",
    },
    {
      question: "Puis-je créer mes propres cours ?",
      answer:
        "Oui, une fois inscrit, vous pouvez créer vos propres cours en accédant à la section 'Créer un cours' dans votre tableau de bord.",
    },
    {
      question: "Est-ce que les cours sont vraiment gratuits ?",
      answer:
        "Oui, tous les cours disponibles sur notre site sont totalement gratuits pour tous les utilisateurs.",
    },
    {
      question: "Comment puis-je contacter le support ?",
      answer:
        "Vous pouvez nous contacter via le formulaire de contact disponible dans la section 'Contact' du site.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Foire Aux Questions (FAQ)</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <h3 className="faq-question">
              {faq.question}{" "}
              <FaChevronUp
                className={`faq-show-answer ${
                  activeIndex === index ? "rotated" : ""
                }`}
              />
            </h3>
            <div
              className={`faq-answer-container ${
                activeIndex === index ? "show" : ""
              }`}
            >
              <p className="faq-answer">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
