import { Browsers } from '../../enums';

class BrowserService {
  get browserName(): Browsers {
    // Firefox gets its own build, Chromium based browsers share the Chrome one
    if (__BROWSER__ === 'firefox') {
      return Browsers.Firefox;
    } else if (navigator.userAgent.indexOf(' OPR/') >= 0) {
      return Browsers.Opera;
    } else if (navigator.userAgent.toLowerCase().indexOf('vivaldi') >= 0) {
      return Browsers.Vivaldi;
    }
    return Browsers.Chrome;
  }

  /**
   * Null when there's no store listing for this browser
   */
  get browserExtensionWebStoreLink(): string {
    let link: string = null;

    switch (this.browserName) {
      case Browsers.Firefox:
        link = `https://addons.mozilla.org/en-GB/firefox/addon/myga`;
        break;
      case Browsers.Opera:
        link = `https://addons.opera.com/en-gb/extensions/details/${(window as any).myga.title}`;
        break;
      // Not in the Chrome Web Store at the moment: set to its listing once it's republished
      default:
      case Browsers.Chrome:
      case Browsers.Other:
      case Browsers.Vivaldi:
        break;
    }

    return link;
  }
}

export default new BrowserService();
