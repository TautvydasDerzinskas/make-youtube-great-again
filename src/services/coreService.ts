import { Images } from '../enums/imagesEnums';

export default class CoreService {
  constructor() {}

  public setExtensionIcon() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const tab = tabs[0];
        if (tab && tab.url != null) {
          let newIcon = Images.Disabled;

          if (this.isActiveTabYoutubeVideo(tab.url)) {
            newIcon = Images.Enabled;
          } else if (this.isActiveTabYoutube(tab.url)) {
            newIcon = Images.Partial;
          }

          chrome.browserAction.setIcon({
            path: `19x19_${newIcon}.png`,
            tabId: tab.id
          });

          this.closePopupWindow();
        }
      }
    });
  }

  public isActiveTabYoutubeVideo(url: string) {
    return this.isActiveTabYoutube(url) && url.toLowerCase().indexOf('watch?') >= 0;
  }

  private isActiveTabYoutube(url: string) {
    if (url) {
      url = url.toLowerCase();
      return url.indexOf('http') === 0 && url.indexOf('youtube') >= 0;
    }

    return false;
  }

  private closePopupWindow() {
    const windows = chrome.extension.getViews({ type: 'popup' });
    if (windows.length) {
      windows[0].close();
    }
  }
}
