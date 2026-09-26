import { IChannel } from './services/channel-blacklist.service';

/**
 * Every kind of video in YouTube™'s lists: home feed, search, sidebar, playlists, channel pages.
 * Newer "lockup" items & the older "renderer" ones are still mixed on many pages.
 */
export const VIDEO_ITEMS = [
  'yt-lockup-view-model',
  'ytd-video-renderer',
  'ytd-compact-video-renderer',
  'ytd-grid-video-renderer',
  'ytd-rich-grid-media',
  'ytd-playlist-video-renderer',
  'ytd-playlist-panel-video-renderer',
].join(', ');

export interface IFoundChannel extends Omit<IChannel, 'addedAt'> {
  /**
   * The blacklist button goes right after it, next to the channel's name
   */
  buttonAnchor: HTMLElement;
}

class ChannelFinder {
  /**
   * The channel of a video in a list, or null when it doesn't show one (e.g. Shorts)
   */
  public find(item: Element): IFoundChannel {
    const candidates = [
      // Lockups: the first text of the first metadata row
      ...item.querySelectorAll<HTMLElement>('yt-content-metadata-view-model .ytContentMetadataViewModelMetadataRow:first-child .ytContentMetadataViewModelMetadataText'),
      // Renderers
      ...item.querySelectorAll<HTMLElement>('ytd-channel-name #text'),
      // Playlist panel next to the video
      ...item.querySelectorAll<HTMLElement>('#byline'),
    ].filter(element => element.textContent.trim());
    // Some renderers have a second, hidden copy of the channel's name: the shown one gets the button
    const nameElement = candidates.find(element => element.getClientRects().length > 0) || candidates[0];

    const name = nameElement && nameElement.textContent.trim().replace(/\s+/g, ' ');
    if (!name) {
      return null;
    }

    const link = item.querySelector<HTMLAnchorElement>('a[href^="/@"], a[href^="/channel/"]');
    return {
      handle: link ? this.handle(link.getAttribute('href')) : null,
      name,
      avatarUrl: this.avatarUrl(item),
      // Renderers clip their name's box: next to the whole channel name element instead
      buttonAnchor: nameElement.closest<HTMLElement>('ytd-channel-name') || nameElement,
    };
  }

  /**
   * The channel of the video being watched, under the player
   */
  public findOwner(): IFoundChannel {
    const owner = document.querySelector('ytd-watch-metadata #owner');
    const nameElement = owner && owner.querySelector<HTMLElement>('ytd-channel-name');
    // The name's own link: the avatar before it links to the channel too, without text
    const link = nameElement && nameElement.querySelector<HTMLAnchorElement>('a');
    const name = link && link.textContent.trim().replace(/\s+/g, ' ');
    if (!name) {
      return null;
    }

    return {
      handle: this.handle(link.getAttribute('href')),
      name,
      avatarUrl: this.avatarUrl(owner),
      buttonAnchor: nameElement,
    };
  }

  /**
   * "/@name/videos?x" → "/@name"
   */
  private handle(href: string) {
    const match = /^\/(@[^/?#]+|channel\/[^/?#]+)/.exec(href || '');
    return match ? `/${decodeURIComponent(match[1])}` : null;
  }

  private avatarUrl(element: Element) {
    const image = element.querySelector<HTMLImageElement>('yt-avatar-shape img, #avatar img, #channel-thumbnail img, yt-img-shadow#avatar img, .ytSpecAvatarShapeImage');
    return image && image.src && image.src.startsWith('https://') ? image.src : null;
  }
}

export default new ChannelFinder();
