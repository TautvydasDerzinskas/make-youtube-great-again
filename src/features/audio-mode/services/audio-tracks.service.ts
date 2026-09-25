/**
 * Marked video IDs live under their own key in local storage: the list keeps growing
 * and would soon exceed the sync storage per-item quota (8KB) all features share
 */
class AudioTracksService {
  private STORAGE_KEY = 'mygaAudioTracks';

  public async getAll(): Promise<string[]> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    return (result[this.STORAGE_KEY] as string[]) || [];
  }

  /**
   * Marks or unmarks the video, returns whether it's marked now
   */
  public async toggle(videoId: string): Promise<boolean> {
    const audioTracks = await this.getAll();
    const isMarked = audioTracks.includes(videoId);

    const updatedTracks = isMarked
      ? audioTracks.filter(id => id !== videoId)
      : [...audioTracks, videoId];
    await chrome.storage.local.set({ [this.STORAGE_KEY]: updatedTracks });

    return !isMarked;
  }

  public async markAll(videoIds: string[]) {
    const audioTracks = await this.getAll();
    const updatedTracks = [...new Set([...audioTracks, ...videoIds])];
    await chrome.storage.local.set({ [this.STORAGE_KEY]: updatedTracks });
  }

  /**
   * Called with the updated list whenever it changes, from any tab.
   * Returns a function removing the listener.
   */
  public onChange(listener: (audioTracks: string[]) => void) {
    const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes[this.STORAGE_KEY]) {
        listener((changes[this.STORAGE_KEY].newValue as string[]) || []);
      }
    };
    chrome.storage.onChanged.addListener(storageListener);
    return () => chrome.storage.onChanged.removeListener(storageListener);
  }
}

export default new AudioTracksService();
