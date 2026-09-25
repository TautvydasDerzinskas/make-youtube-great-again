import {
  AUDIO_MODE_PLAYLIST_REQUEST_EVENT,
  AUDIO_MODE_PLAYLIST_RESPONSE_EVENT,
  IPlaylistVideosRequest,
  IPlaylistVideosResponse,
} from './audio-mode.events';
import innertubeService from '../../services/page/innertube.service';

/**
 * Runs in the page's own world. The playlist panel only holds the first ~200 videos,
 * so all of them are fetched the way YouTube™'s own playlist page does: 100 per request
 */
const MAX_PAGES = 100;
const CACHE_TIME = 10 * 60 * 1000;

class PlaylistVideosPage {
  private cache = new Map<string, { videoIds: Promise<string[]>, fetchedAt: number }>();

  constructor() {
    document.addEventListener(AUDIO_MODE_PLAYLIST_REQUEST_EVENT, (event: CustomEvent<string>) => {
      const { requestId, listId }: IPlaylistVideosRequest = JSON.parse(event.detail);

      this.getVideoIds(listId).then(
        videoIds => this.respond({ requestId, videoIds }),
        error => {
          this.cache.delete(listId);
          this.respond({ requestId, error: String(error && error.message || error) });
        },
      );
    });
  }

  private respond(response: IPlaylistVideosResponse) {
    document.dispatchEvent(new CustomEvent(AUDIO_MODE_PLAYLIST_RESPONSE_EVENT, { detail: JSON.stringify(response) }));
  }

  private getVideoIds(listId: string) {
    const cached = this.cache.get(listId);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TIME) {
      return cached.videoIds;
    }

    const videoIds = this.fetchVideoIds(listId);
    this.cache.set(listId, { videoIds, fetchedAt: Date.now() });
    return videoIds;
  }

  private async fetchVideoIds(listId: string): Promise<string[]> {
    const videoIds = new Set<string>();
    let body: object = { browseId: `VL${listId}` };

    for (let page = 0; page < MAX_PAGES; page++) {
      const continuationToken = this.collectVideoIds(await innertubeService.post('browse', body), videoIds);
      if (!continuationToken) {
        break;
      }
      body = { continuation: continuationToken };
    }

    if (videoIds.size === 0) {
      throw new Error('no videos found');
    }

    return [...videoIds];
  }

  /**
   * Walks the whole response instead of a fixed path, so layout changes on YouTube™'s side
   * don't break it. Returns the token for the next 100 videos, if there are more.
   */
  private collectVideoIds(json: any, videoIds: Set<string>): string {
    let continuationToken: string = null;
    const stack = [json];

    while (stack.length > 0) {
      const node = stack.pop();
      if (!node || typeof node !== 'object') {
        continue;
      }

      // Older layout
      if (node.playlistVideoRenderer && node.playlistVideoRenderer.videoId) {
        videoIds.add(node.playlistVideoRenderer.videoId);
        continue;
      }

      // Current layout
      if (node.lockupViewModel && node.lockupViewModel.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO') {
        videoIds.add(node.lockupViewModel.contentId);
        continue;
      }

      const continuationItem = node.continuationItemViewModel || node.continuationItemRenderer;
      if (continuationItem && !continuationToken) {
        continuationToken = this.findContinuationToken(continuationItem);
      }

      for (const key in node) {
        stack.push(node[key]);
      }
    }

    return continuationToken;
  }

  private findContinuationToken(node: any): string {
    if (!node || typeof node !== 'object') {
      return null;
    }
    if (node.continuationCommand && typeof node.continuationCommand.token === 'string') {
      return node.continuationCommand.token;
    }

    for (const key in node) {
      const token = this.findContinuationToken(node[key]);
      if (token) {
        return token;
      }
    }
    return null;
  }
}

export default new PlaylistVideosPage();
