type indexStateType = {
  activeIndex: number;
};

const rootSelector = "[data-js-accordion]";

class Accordion {
  private readonly selectors: Record<string, string> = {
    root: rootSelector,
    button: "[data-js-accordion-button]",
    content: "[data-js-accordion-content]",
  };
  private readonly stateClasses: Record<string, string> = {
    isActive: "is-active",
  };
  private readonly stateAttributes: Record<string, string> = {
    ariaExpanded: "aria-expanded",
  };
  private rootElement: HTMLElement;
  private buttonElements!: NodeListOf<HTMLElement>;
  private state!: indexStateType;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    if (!this.rootElement) return;
    this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button);
    this.state = this.getProxyState({
      activeIndex: [...this.buttonElements].findIndex((buttonElement: HTMLElement) =>
        buttonElement.classList.contains(this.stateClasses.isActive)
      ),
    });
    this.init();
  }

  private init(): void {
    if (!this.isReady()) return;
    this.bindEvents();
    this.observeContentChanges();
    this.updateUI();
  }
  isReady(): boolean {
    return !!this.rootElement && !!this.buttonElements.length;
  }

  private bindEvents(): void {
    this.buttonElements.forEach((buttonElement, index: number) => {
      buttonElement?.addEventListener("click", () => this.onButtonClick(index));
    });

    window.addEventListener("resize", () => {
      this.updateUI();
    });
  }

  private getProxyState(state: indexStateType) {
    return new Proxy(state, {
      get: (target: indexStateType, prop: keyof indexStateType) => {
        return target[prop];
      },
      set: (target: indexStateType, prop: keyof indexStateType, value: number) => {
        target[prop] = value;
        this.updateUI();

        return true;
      },
    });
  }

  private updateUI() {
    this.buttonElements.forEach((buttonElement: HTMLElement, index: number) => {
      const isActive = this.state.activeIndex === index;
      const content = buttonElement.nextElementSibling as HTMLElement;

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
      buttonElement.setAttribute(this.stateAttributes.ariaExpanded, isActive.toString());
      content.classList.toggle(this.stateClasses.isActive, isActive);
      content.style.maxHeight = isActive ? `${content.scrollHeight}px` : "";
    });
  }

  private onButtonClick(index: number) {
    if (this.state.activeIndex === index) {
      this.state.activeIndex = -1;
    } else {
      this.state.activeIndex = index;
    }
  }

  private observeContentChanges(): void {
    const observer = new MutationObserver(() => {
      this.updateUI();
    });

    observer.observe(this.rootElement, {
      attributes: true,
      attributeFilter: ["open"],
      childList: true,
      subtree: true,
    });
  }
}

class AccordionCollection {
  public init(): void {
    document.querySelectorAll(rootSelector).forEach(element => new Accordion(element as HTMLElement));
  }
}

export default AccordionCollection;
