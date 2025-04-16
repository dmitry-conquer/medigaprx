type indexStateType = {
  activeIndexes: Set<number>;
};

class Steps {
  private readonly selectors: Record<string, string> = {
    root: "[data-js-steps]",
    button: "[data-js-steps-button]",
    content: "[data-js-steps-content]",
    step: "[data-js-step]",
  };
  private readonly stateClasses: Record<string, string> = {
    isActive: "is-active",
  };
  private rootElement: HTMLElement;
  private buttonElements: NodeListOf<HTMLElement>;
  private state: indexStateType;

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root) as HTMLElement;
    this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button);
    this.state = this.getProxyState({
      activeIndexes: new Set(
        [...this.buttonElements]
          .map((buttonElement, index) => (buttonElement.classList.contains(this.stateClasses.isActive) ? index : null))
          .filter(index => index !== null) as number[]
      ),
    });
  }

  private isReady(): boolean {
    return !!this.rootElement && !!this.buttonElements.length;
  }

  public init(): void {
    if (!this.isReady()) return;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.buttonElements.forEach((buttonElement, index: number) => {
      buttonElement?.addEventListener("click", () => this.onButtonClick(index));
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
    const { activeIndexes } = this.state;
    this.buttonElements.forEach((buttonElement: HTMLElement, index: number) => {
      const isActive = activeIndexes.has(index);
      const step = buttonElement.closest(this.selectors.step) as HTMLElement;
      const content = step.querySelector(this.selectors.content) as HTMLElement;

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
      content.style.maxHeight = isActive ? `${content.scrollHeight}px` : "";
    });
  }

  private onButtonClick(index: number) {
    if (this.state.activeIndexes.has(index)) {
      this.state.activeIndexes.delete(index);
    } else {
      this.state.activeIndexes.add(index);
    }
    this.state.activeIndexes = new Set(this.state.activeIndexes);
  }
}

export default Steps;
