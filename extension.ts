import CoreService from './src/services/coreService';
import { Settings } from './src/enums/coreEnums';

const coreService = new CoreService();

chrome.browserAction.onClicked.addListener((tab) => {
  if (coreService.isActiveTabYoutubeVideo(tab.url)) {
    chrome.tabs.create({ url: Settings.Provider + tab.url });
  }
});

chrome.tabs.onRemoved.addListener(() => { coreService.setExtensionIcon(); });
chrome.tabs.onCreated.addListener(() => { coreService.setExtensionIcon(); });
chrome.tabs.onUpdated.addListener(() => { coreService.setExtensionIcon(); });
chrome.tabs.onActivated.addListener(() => { coreService.setExtensionIcon(); });
