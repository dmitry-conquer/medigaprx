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
  private itemHasSubmenuElements: HTMLElement[] = [];

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);

    if (!this.rootElement) return;
    this.overlayElement = this.rootElement?.querySelector(this.selectors.overlay) || null;
    this.triggerButtonElement = this.rootElement?.querySelector(this.selectors.triggerButton) || null;
    this.itemHasSubmenuElements = Array.from(this.rootElement.querySelectorAll(".menu-item-has-children"));
  }

  public init(): void {
    if (!this.isReady()) return;
    this.bindEvents();
  }
  private isReady(): boolean {
    return !!this.rootElement && !!this.overlayElement && !!this.triggerButtonElement;
  }

  private onDocumentClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (
      (this.triggerButtonElement?.id && target.closest(`#${this.triggerButtonElement.id}`)) ||
      (this.rootElement?.id && target.closest(`#${this.rootElement.id}`)) ||
      target.closest(".menu-item-has-children")
    )
      return;
    this.itemHasSubmenuElements.forEach(menuItem => {
      const subMenu = menuItem.querySelector("ul") as HTMLElement;
      if (!subMenu) return;
      menuItem?.classList.remove("is-active");
      subMenu.style.maxHeight = "";
    });
  };

  private toggleSubmenu(currentIndex: number): void {
    this.itemHasSubmenuElements.forEach((menuItem, index) => {
      const subMenu = menuItem.querySelector("ul") as HTMLElement;
      if (!subMenu) return;
      const active = menuItem.classList.contains("is-active");

      if (currentIndex === index) {
        menuItem?.classList.toggle("is-active");
        subMenu.style.maxHeight = active ? "" : `${subMenu.scrollHeight}px`;
      } else {
        menuItem.classList.remove("is-active");
        subMenu.style.maxHeight = "";
      }
    });
  }

  private handleInteraction(index: number, e: MouseEvent) {
    const menuItem = this.itemHasSubmenuElements[index];
    const isActive = menuItem.classList.contains("is-active");

    if (!isActive) {
      e.preventDefault();
      this.toggleSubmenu(index);
    }
  }

  private onTriggerButtonClick = (): void => {
    this.triggerButtonElement?.classList.toggle(this.stateClasses.isActive);
    this.overlayElement?.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock);
  };

  get isTouchDevice() {
    return navigator.maxTouchPoints > 0 || window.matchMedia?.("(pointer: coarse)")?.matches;
  }

  private bindEvents(): void {
    document.addEventListener("click", this.onDocumentClick);
    this.triggerButtonElement?.addEventListener("click", this.onTriggerButtonClick);
    this.overlayElement?.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        this.triggerButtonElement?.classList.remove(this.stateClasses.isActive);
        this.overlayElement?.classList.remove(this.stateClasses.isActive);
        document.documentElement.classList.remove(this.stateClasses.isLock);
      });
    });

    this.itemHasSubmenuElements.forEach((item, index) => {
      (item.querySelector(":scope > a") as HTMLElement | null)?.addEventListener("click", (event: MouseEvent) => {
        if (this.isTouchDevice) {
          this.handleInteraction(index, event);
        }
      });
    });
  }
}

export default Header;
