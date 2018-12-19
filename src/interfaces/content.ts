export default interface IContent {
  setupEventListeners(): Promise<boolean>;
  setupCommunications(): Promise<boolean>;
  extendPageUserInterface(): Promise<boolean>;
}
