import "./Contact.css";
import { FaLongArrowAltRight } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Contact() {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "5ed6e67b-9edd-47ab-a822-f69df450b44a");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      Swal.fire({
        title: "Merci pour votre message !",
        text: "Nous vous répondrons dans les plus brefs délais.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#49a6f3",
      }).then(() => {
        event.target.reset();
      });
    }
  };

  return (
    <div className="contact-body">
      <div className="contact-container">
        <h1 className="contact-title">Contactez-nous</h1>
        <p className="contact-description">
          Vous avez des questions, des suggestions ou des remarques ? N'hésitez
          pas à nous contacter.
        </p>
        <form className="contact-form" onSubmit={onSubmit}>
          <input
            className="contact-input"
            type="email"
            name="email"
            placeholder="Votre mail"
            required
          />
          <textarea
            className="contact-textarea"
            placeholder="Votre message..."
            name="message"
            required
          />
          <button className="contact-button" type="submit">
            Envoyer <FaLongArrowAltRight className="contact-btn-icon" />
          </button>
        </form>
      </div>
    </div>
  );
}
