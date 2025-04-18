export class Header {
  private readonly selectors: Record<string, string> = {
    root: "[data-js-header]",
    overlay: "[data-js-header-overlay]",
    triggerButton: "[data-js-header-trigger-button]",
  };

  private readonly stateClasses: Record<string, string> = {
    isActive: "is-active",
    isLock: "is-lock",
  };

  private rootElement: HTMLElement | null = null;
  private overlayElement: HTMLElement | null = null;
  private triggerButtonElement: HTMLElement | null = null;

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);

    if (!this.rootElement) return;
    this.overlayElement = this.rootElement?.querySelector(this.selectors.overlay) || null;
    this.triggerButtonElement = this.rootElement?.querySelector(this.selectors.triggerButton) || null;
  }

  public init(): void {
    if (!this.isReady()) return;
    this.bindEvents();
  }
  private isReady(): boolean {
    return !!this.rootElement && !!this.overlayElement && !!this.triggerButtonElement;
  }

  private onTriggerButtonClick = (): void => {
    this.triggerButtonElement?.classList.toggle(this.stateClasses.isActive);
    this.overlayElement?.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock);
  };

  private bindEvents(): void {
    this.triggerButtonElement?.addEventListener("click", this.onTriggerButtonClick);
    this.overlayElement?.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        this.triggerButtonElement?.classList.remove(this.stateClasses.isActive);
        this.overlayElement?.classList.remove(this.stateClasses.isActive);
        document.documentElement.classList.remove(this.stateClasses.isLock);
      });
    });
  }
}

export default Header;
