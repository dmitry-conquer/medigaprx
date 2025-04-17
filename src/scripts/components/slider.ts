import Swiper from "swiper";
import "swiper/swiper-bundle.css";

export default class Slider {
  public init() {
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
  }
}
