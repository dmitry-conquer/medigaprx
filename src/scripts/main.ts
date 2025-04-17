import "../styles/main.scss";
import Steps from "./components/steps";
import AccordionCollection from "./components/accordion";
import Swiper from "swiper";
import "swiper/swiper-bundle.css";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Swiper
  const stepsNode = document.getElementById("steps-slider");
  if (stepsNode) {
    new Swiper(stepsNode, {
      slidesPerView: 3,
      spaceBetween: 20,
      speed: 900,
      breakpoints: {
        0: {
          slidesPerView: 1.3,
        },
        600: {
          slidesPerView: 1.8,
        },
        820: {
          slidesPerView: 2.2,
        },
        1200: {
          slidesPerView: 3,
        },
      },
    });
  }

  const steps = new Steps();
  steps.init();

  const accordionCollection = new AccordionCollection();
  accordionCollection.init();
});
