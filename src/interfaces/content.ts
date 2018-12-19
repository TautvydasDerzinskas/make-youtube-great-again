export default interface IContent {
  setupEventListeners?(): void;
  setupCommunications?(): void;
  extendPageUserInterface?(): void;
}
