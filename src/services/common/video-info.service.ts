export interface IVideoInfo {
  id: string;
  title: string;
  thumbnailUrl: string;
}

/**
 * Titles come from YouTube™'s public oEmbed endpoint: no API key, so it works
 * however the extension is installed. Cached locally, as titles rarely change.
 */
class VideoInfoService {
  private CACHE_KEY = 'mygaVideoTitles';
  private CACHE_LIMIT = 500;

  public getThumbnailUrl(videoId: string) {
    return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/default.jpg`;
  }

  /**
   * Videos whose title can't be loaded (deleted, private, offline) get their link as the title
   */
  public async getVideos(videoIds: string[]): Promise<IVideoInfo[]> {
    const cache = await this.getCache();
    const titles = await Promise.all(videoIds.map(async videoId => {
      if (cache[videoId]) {
        return cache[videoId];
      }
      const title = await this.fetchTitle(videoId);
      if (title) {
        cache[videoId] = title;
      }
      return title;
    }));
    await this.saveCache(cache);

    return videoIds.map((id, index) => ({
      id,
      title: titles[index] || `youtube.com/watch?v=${id}`,
      thumbnailUrl: this.getThumbnailUrl(id),
    }));
  }

  private async fetchTitle(videoId: string): Promise<string> {
    try {
      const videoUrl = encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`);
      const response = await fetch(`https://www.youtube.com/oembed?url=${videoUrl}&format=json`);
      if (!response.ok) {
        return null;
      }
      const data: { title?: string } = await response.json();
      return data.title || null;
    } catch {
      return null;
    }
  }

  private async getCache(): Promise<Record<string, string>> {
    try {
      const result = await chrome.storage.local.get(this.CACHE_KEY);
      return (result[this.CACHE_KEY] as Record<string, string>) || {};
    } catch {
      return {};
    }
  }

  private async saveCache(cache: Record<string, string>) {
    const entries = Object.entries(cache);
    const trimmed = Object.fromEntries(entries.slice(Math.max(0, entries.length - this.CACHE_LIMIT)));
    try {
      await chrome.storage.local.set({ [this.CACHE_KEY]: trimmed });
    } catch {
      // Only a cache
    }
  }
}

export default new VideoInfoService();
