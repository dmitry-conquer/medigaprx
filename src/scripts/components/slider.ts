//@ts-expect-error expected error
import Swiper, { Autoplay, Pagination } from "swiper";

export default class Slider {
  private partnersSlider: Swiper | null = null;

  private stepsNodeId: string = "steps-slider";
  private partnersNodeId: string = "partners-slider";

  public init() {
    this.initStepsSlider();
    this.initPartnersSlider();
    this.addResizeListener();
  }

  private initStepsSlider() {
    const stepsNode = document.getElementById(this.stepsNodeId);
    if (stepsNode) {
      new Swiper(stepsNode, {
        modules: [Pagination],
        slidesPerView: 3,
        spaceBetween: 20,
        speed: 900,
        pagination: {
          el: ".steps__pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1.35,
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

  private initPartnersSlider() {
    const partnersNode = document.getElementById(this.partnersNodeId);
    if (partnersNode) {
      this.partnersSlider = new Swiper(partnersNode, {
        modules: [Autoplay],
        spaceBetween: 40,
        speed: 4000,
        autoplay: {
          delay: 5,
        },
        slidesPerView: "auto",
        loop: true,
        breakpoints: {
          0: {
            spaceBetween: 20,
          },
          600: {
            spaceBetween: 30,
          },
          820: {
            spaceBetween: 40,
          },
        },
      });
    }
  }

  private addResizeListener() {
    window.addEventListener("resize", () => {
      const partnersNode = document.getElementById(this.partnersNodeId);
      if (partnersNode && this.partnersSlider) {
        this.partnersSlider.destroy(true, true);
        this.initPartnersSlider();
      }
    });
  }
}
