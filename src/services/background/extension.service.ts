import YoutubeService from '../common/youtube.service';

class ExtensionService extends YoutubeService {
  public updateToolbarIcon() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const tab = tabs[0];
        if (tab && tab.url != null) {
          let newIcon = '_disabled';

          if (this.isActiveTabYoutubeVideo(tab.url)) {
            newIcon = '';
          }

          chrome.action.setIcon({
            path: `icons/icon${newIcon}_38x38.png`,
            tabId: tab.id
          });
        }
      }
    });
  }
}

export default new ExtensionService();
