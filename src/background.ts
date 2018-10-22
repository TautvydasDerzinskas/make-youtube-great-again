import CoreService from './services/coreService';
import HistoryService from './services/historyService';

import { Settings } from './enums/coreEnums';
import { MessageTypes } from './enums/messagesEnums';

import ISong from './interfaces/songInterface';

const coreService = new CoreService();
const historyService = new HistoryService();

chrome.browserAction.onClicked.addListener((tab) => {
  if (coreService.isActiveTabYoutubeVideo(tab.url)) {
    chrome.tabs.sendMessage(tab.id, MessageTypes.GetSong, (song: ISong) => {
      historyService.addSong(song);

      chrome.tabs.create({ url: Settings.Provider + tab.url });
    });
  }
});

chrome.tabs.onRemoved.addListener(() => { coreService.setExtensionIcon(); });
chrome.tabs.onCreated.addListener(() => { coreService.setExtensionIcon(); });
chrome.tabs.onUpdated.addListener(() => { coreService.setExtensionIcon(); });
chrome.tabs.onActivated.addListener(() => { coreService.setExtensionIcon(); });
