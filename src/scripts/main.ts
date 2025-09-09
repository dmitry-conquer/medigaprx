import "../styles/main.scss";
import Steps from "./components/steps";
import AccordionCollection from "./components/accordion";
import TabsCollection from "./components/tabs";
import Header from "./components/header";
import Slider from "./components/slider";
import BackTopButton from "./components/back-top";
import Lenis from "lenis";
import AOS from "aos";
import AdaptiveDOM from "./AdaptiveDOM";
import Marquee from "./components/marquee";
import "aos/dist/aos.css";
import "lenis/dist/lenis.css";

declare const acfData: {
  smoothScroll?: boolean;
};

document.addEventListener("DOMContentLoaded", () => {
  new AdaptiveDOM();
  new Marquee("marquee-track");

  const steps = new Steps();
  steps.init();

  new TabsCollection();

  const accordionCollection = new AccordionCollection();
  accordionCollection.init();

  const header = new Header();
  header.init();

  const slider = new Slider();
  slider.init();

  const backTopButton = new BackTopButton();
  backTopButton.init();

  AOS.init({
    once: true,
    duration: 700,
  });

  if (typeof acfData !== "undefined" && acfData.smoothScroll) {
    new Lenis({
      autoRaf: true,
      anchors: true,
    });
  }
});
