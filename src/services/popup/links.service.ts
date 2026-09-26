import { Browsers } from '../../enums';
import browserService from '../common/browser.service';

/**
 * The Links tab is built from links.json in the GitHub repository, so links can change without
 * a release. When it can't be loaded, the tab isn't shown at all.
 */
const LINKS_URL = 'https://raw.githubusercontent.com/TautvydasDerzinskas/make-youtube-great-again/main/links.json';
const FETCH_TIMEOUT = 5000;

export interface ILink {
  label: string;
  url: string;
  /**
   * A bundled icon ("github.svg" from assets/vectors, "author.webp" from assets/images) or an https image URL
   */
  icon: string;
  /**
   * The browsers showing it: "chrome" (Chromium browsers but Edge), "edge" and / or "firefox".
   * Versions before Edge support show "chrome" links in Edge.
   */
  browsers: Array<'chrome' | 'edge' | 'firefox'>;
  /**
   * Twice as wide
   */
  wide?: boolean;
}

class LinksService {
  private links: Promise<ILink[]>;

  /**
   * This build's links, or null when they can't be loaded (offline, blocked, invalid file, none for this browser).
   * Loaded once per popup opening.
   */
  public getLinks(): Promise<ILink[]> {
    if (!this.links) {
      this.links = this.fetchLinks().catch((): ILink[] => null);
    }
    return this.links;
  }

  private async fetchLinks(): Promise<ILink[]> {
    const response = await fetch(LINKS_URL, { cache: 'no-cache', signal: AbortSignal.timeout(FETCH_TIMEOUT) });
    if (!response.ok) {
      throw new Error(`links.json request failed (${response.status})`);
    }

    const data: { links?: unknown } = await response.json();
    const links = (Array.isArray(data.links) ? data.links : [])
      .filter((link): link is ILink => this.isValid(link))
      .filter(link => link.browsers.includes(this.browser));

    if (links.length === 0) {
      throw new Error('No links for this browser');
    }
    return links;
  }

  /**
   * Edge runs the Chrome build but gets its own links, pointing to its own store
   */
  private get browser(): ILink['browsers'][number] {
    return browserService.browserName === Browsers.Edge ? 'edge' : __BROWSER__;
  }

  /**
   * Only https links: the file comes from outside the extension
   */
  private isValid(link: any): boolean {
    return Boolean(link)
      && typeof link.label === 'string' && link.label.trim() !== ''
      && typeof link.url === 'string' && link.url.startsWith('https://')
      && typeof link.icon === 'string' && link.icon !== ''
      && Array.isArray(link.browsers);
  }
}

export default new LinksService();
