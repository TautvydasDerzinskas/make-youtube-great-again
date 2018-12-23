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

          chrome.browserAction.setIcon({
            path: `icons/icon${newIcon}_16x16.png`,
            tabId: tab.id
          });

          this.closePopupWindow();
        }
      }
    });
  }

  private closePopupWindow() {
    const windows = chrome.extension.getViews({ type: 'popup' });
    if (windows.length) {
      windows[0].close();
    }
  }
}

export default new ExtensionService();
