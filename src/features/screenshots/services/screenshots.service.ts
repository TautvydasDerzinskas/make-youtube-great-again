export interface IScreenshot {
  id: string;
  videoId: string;
  videoTitle: string;
  /**
   * Seconds into the video
   */
  time: number;
  width: number;
  height: number;
  createdAt: number;
  /**
   * Small JPEG data URL, so the popup's list loads fast without the full images
   */
  thumbnail: string;
}

/**
 * Shared by the content script & the popup. The list (with thumbnails) is one item,
 * each full size image another, so adding or deleting one never rewrites the others.
 * Local storage, with the "unlimitedStorage" permission: images don't fit its 10MB default.
 */
class ScreenshotsService {
  private INDEX_KEY = 'mygaScreenshots';
  private IMAGE_KEY_PREFIX = 'mygaScreenshot_';

  public async getAll(): Promise<IScreenshot[]> {
    const result = await chrome.storage.local.get(this.INDEX_KEY);
    const screenshots = (result[this.INDEX_KEY] as IScreenshot[]) || [];
    return screenshots.toSorted((a, b) => b.createdAt - a.createdAt);
  }

  public async getForVideo(videoId: string) {
    return (await this.getAll()).filter(screenshot => screenshot.videoId === videoId);
  }

  public async getImage(screenshotId: string): Promise<string> {
    const key = this.IMAGE_KEY_PREFIX + screenshotId;
    const result = await chrome.storage.local.get(key);
    return (result[key] as string) || null;
  }

  public async add(screenshot: Omit<IScreenshot, 'id' | 'createdAt'>, image: string) {
    const saved: IScreenshot = { ...screenshot, id: crypto.randomUUID(), createdAt: Date.now() };
    // Image first: the list never points to a missing one
    await chrome.storage.local.set({ [this.IMAGE_KEY_PREFIX + saved.id]: image });
    await chrome.storage.local.set({ [this.INDEX_KEY]: [saved, ...await this.getAll()] });
    return saved;
  }

  public async remove(screenshotId: string) {
    await chrome.storage.local.set({ [this.INDEX_KEY]: (await this.getAll()).filter(item => item.id !== screenshotId) });
    await chrome.storage.local.remove(this.IMAGE_KEY_PREFIX + screenshotId);
  }

  /**
   * Called whenever the list changes, from any tab or the popup. Returns a function removing the listener.
   */
  public onChange(listener: () => void) {
    const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes[this.INDEX_KEY]) {
        listener();
      }
    };
    chrome.storage.onChanged.addListener(storageListener);
    return () => chrome.storage.onChanged.removeListener(storageListener);
  }

  public videoUrl(screenshot: IScreenshot) {
    return `https://www.youtube.com/watch?v=${encodeURIComponent(screenshot.videoId)}&t=${screenshot.time}s`;
  }

  /**
   * "Video title - 1m23s.jpg", without characters file systems don't allow
   */
  public fileName(screenshot: IScreenshot) {
    const title = screenshot.videoTitle.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100) || screenshot.videoId;
    const minutes = Math.floor(screenshot.time / 60);
    return `${title} - ${minutes}m${String(screenshot.time % 60).padStart(2, '0')}s.jpg`;
  }

  /**
   * 83 → "1:23", 3723 → "1:02:03", like YouTube™'s own timestamps
   */
  public formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = String(seconds % 60).padStart(2, '0');
    return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${minutes}:${secs}`;
  }
}

export default new ScreenshotsService();
