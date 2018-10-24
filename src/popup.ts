import './popup.scss';

import CoreService from './services/coreService';
import HistoryService from './services/historyService';
import UiService from './services/uiService';
import ClickService from './services/clickService';

const coreService = new CoreService();
const historyService = new HistoryService();
const uiService = new UiService(historyService);
const clickService = new ClickService(historyService);

/**
 * Extension popup related logic
 */
window.onload = () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const tab = tabs[0];

      if (tab && coreService.isActiveTabYoutubeVideo(tab.url)) {
        clickService.setupSaveButtonClick(tab);
      } else {
        uiService.hideSaveButton();
      }

      uiService.renderSongList().then(() => {
        clickService.setupSongRemoveButtonClick();
      });
    }
  });
};

/**
 * Updating extension icon in the toolbar
 */
chrome.tabs.onRemoved.addListener(() => { coreService.setExtensionIcon(); window.close(); });
chrome.tabs.onCreated.addListener(() => { coreService.setExtensionIcon(); window.close(); });
chrome.tabs.onUpdated.addListener(() => { coreService.setExtensionIcon(); window.close(); });
chrome.tabs.onActivated.addListener(() => { coreService.setExtensionIcon(); window.close(); });
