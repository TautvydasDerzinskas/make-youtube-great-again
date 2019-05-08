import browserService from '../common/browser.service';
import { ApiKeys, Browsers } from '../../enums';

class AnalyticsService {
  private extensionName = chrome.runtime.getManifest().name.replace(/\s+/g, '-').toLowerCase();
  private version = chrome.runtime.getManifest().version;

  get global(): any { return window; }
  get isBrowserNotFirefox() {
    // Firefox doesn't allow analytics
    return browserService.browserName !== Browsers.Firefox;
  }

  public initialize() {
    if (this.isBrowserNotFirefox) {
      this.global._gaq = this.global._gaq || [];
      this.global._gaq.push(['_setAccount', ApiKeys.Analytics]);

      const ga = document.createElement('script');
      ga.type = 'text/javascript';
      ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      const s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(ga, s);
    }
  }

  public trackPageView(pageName: string) {
    if (this.isBrowserNotFirefox) {
      this.global._gaq.push([
        '_trackPageview',
        `/${this.extensionName}?v=${this.version}&p=${pageName}&b=${browserService.browserName}`,
      ]);
    }
  }
}

export default new AnalyticsService();
