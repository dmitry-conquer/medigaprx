import "../styles/main.scss";
import Steps from "./components/steps";
import AccordionCollection from "./components/accordion";
import Header from "./components/header";
import Slider from "./components/slider";
import BackTopButton from "./components/back-top";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

declare const acfData: {
  smoothScroll?: boolean;
};

document.addEventListener("DOMContentLoaded", () => {
  const steps = new Steps();
  steps.init();

  const accordionCollection = new AccordionCollection();
  accordionCollection.init();

  const header = new Header();
  header.init();

  const slider = new Slider();
  slider.init();

  const backTopButton = new BackTopButton();
  backTopButton.init();

  if (acfData.smoothScroll) {
    new Lenis({
      autoRaf: true,
      anchors: true,
    });
  }
});
