import './styles/popup.scss';

import CoreService from './services/coreService';
import HistoryService from './services/historyService';
import UiService from './services/uiService';
import ClickService from './services/clickService';
import TabsService from './services/tabsService';

const coreService = new CoreService();
const historyService = new HistoryService();
const uiService = new UiService(historyService);
const clickService = new ClickService(historyService);
const tabsService = new TabsService(
  '.tabs__tab',
  'tab--active',
  '.tabs-content__content',
  'content--active',
);

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
        uiService.hideSaveButtons();
      }

      uiService.renderSongList().then(() => {
        clickService.setupSongRemoveButtonClick();
      });
    }
  });
};
