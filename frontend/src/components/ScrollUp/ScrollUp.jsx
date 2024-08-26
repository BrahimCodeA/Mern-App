import React, { useEffect } from "react";
import "./ScrollUp.css";
import { FaLevelUpAlt } from "react-icons/fa";

export default function ScrollUp() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollUp = document.querySelector(".scrollup");
      if (window.scrollY >= 560) {
        scrollUp.classList.add("show-scroll");
      } else {
        scrollUp.classList.remove("show-scroll");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className="scrollup"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FaLevelUpAlt />
      </div>
    </>
  );
}
