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
}

export default new BrowserService();
