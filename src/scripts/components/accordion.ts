type indexStateType = {
  activeIndexes: Set<number>;
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
      activeIndexes: new Set<number>(
        [...this.buttonElements].reduce((acc: Set<number>, buttonElement: HTMLElement, index: number) => {
          if (buttonElement.classList.contains(this.stateClasses.isActive)) {
            acc.add(index);
          }
          return acc;
        }, new Set<number>())
      ),
    });
    this.init();
  }

  private init(): void {
    if (!this.isReady()) return;
    this.bindEvents();
    this.observeContentChanges();
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
      set: (target: indexStateType, prop: keyof indexStateType, value: Set<number>) => {
        target[prop] = value;
        this.updateUI();

        return true;
      },
    });
  }

  private updateUI() {
    this.buttonElements.forEach((buttonElement: HTMLElement, index: number) => {
      const isActive = this.state.activeIndexes.has(index);
      const content = buttonElement.nextElementSibling as HTMLElement;

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
      buttonElement.setAttribute(this.stateAttributes.ariaExpanded, isActive.toString());
      content.classList.toggle(this.stateClasses.isActive, isActive);
      content.style.maxHeight = isActive ? `${content.scrollHeight}px` : "";
    });
  }

  private onButtonClick(index: number) {
    if (this.state.activeIndexes.has(index)) {
      this.state.activeIndexes.delete(index);
    } else {
      this.state.activeIndexes.add(index);
    }
    this.state.activeIndexes = new Set<number>(this.state.activeIndexes);
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
