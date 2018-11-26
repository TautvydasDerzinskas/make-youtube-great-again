export default class TabsService {
  private tabs: NodeListOf<Element>;
  private tabContents: NodeListOf<Element>;

  constructor(
    private TAB_SELECTOR: string,
    private ACTIVE_TAB_CLASS: string,
    private TAB_CONTENT_SELECTOR: string,
    private ACTIVE_TAB_CONTENT_SELECTOR: string,
  ) {
    this.tabs = document.querySelectorAll(this.TAB_SELECTOR);
    this.tabContents = document.querySelectorAll(this.TAB_CONTENT_SELECTOR);
    this.setupClickEvents();
  }

  private setupClickEvents() {
    this.tabs.forEach((tabElement) => {
      tabElement.addEventListener('click', (event) => {
        const clickElement = <Element>event.target;
        const isTabActive = tabElement.className.includes(this.ACTIVE_TAB_CLASS);
        if (!isTabActive) {
          this.deactivateAllTabs();
          clickElement.classList.add(this.ACTIVE_TAB_CLASS);
          const index = this.getElementsIndex(clickElement);
          this.tabContents[index].classList.add(this.ACTIVE_TAB_CONTENT_SELECTOR);
        }
      }, true);
    });
  }

  private deactivateAllTabs() {
    this.tabs.forEach((tabElement, index) => {
      tabElement.classList.remove(this.ACTIVE_TAB_CLASS);
      this.tabContents[index].classList.remove(this.ACTIVE_TAB_CONTENT_SELECTOR);
    });
  }

  private getElementsIndex(element: Element) {
    let index = 0;
    while (element = element.previousElementSibling) {
      index += 1;
    }
    return index;
  }
}
