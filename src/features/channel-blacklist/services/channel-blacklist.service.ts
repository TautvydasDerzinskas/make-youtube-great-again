export interface IChannel {
  /**
   * "/@handle" or "/channel/UC…". Some lists (e.g. the sidebar next to a video) only show the
   * channel's name, so channels blacklisted from there have none.
   */
  handle: string;
  name: string;
  avatarUrl: string;
  addedAt: number;
}

/**
 * Shared by the content script & the popup
 */
class ChannelBlacklistService {
  private STORAGE_KEY = 'mygaChannelBlacklist';

  public async getAll(): Promise<IChannel[]> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    const channels = (result[this.STORAGE_KEY] as IChannel[]) || [];
    return channels.toSorted((a, b) => b.addedAt - a.addedAt);
  }

  public async add(channel: Omit<IChannel, 'addedAt'>) {
    const channels = (await this.getAll()).filter(item => !this.isSameChannel(item, channel));
    await this.save([{ ...channel, addedAt: Date.now() }, ...channels]);
  }

  public async remove(channel: Pick<IChannel, 'handle' | 'name'>) {
    await this.save((await this.getAll()).filter(item => !this.isSameChannel(item, channel)));
  }

  /**
   * The same channel by its handle when both have one, otherwise by its name
   */
  public isSameChannel(a: Pick<IChannel, 'handle' | 'name'>, b: Pick<IChannel, 'handle' | 'name'>) {
    if (a.handle && b.handle) {
      return a.handle.toLowerCase() === b.handle.toLowerCase();
    }
    return this.normalizeName(a.name) === this.normalizeName(b.name);
  }

  public normalizeName(name: string) {
    return (name || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  /**
   * Called whenever the list changes, from any tab or the popup. Returns a function removing the listener.
   */
  public onChange(listener: () => void) {
    const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes[this.STORAGE_KEY]) {
        listener();
      }
    };
    chrome.storage.onChanged.addListener(storageListener);
    return () => chrome.storage.onChanged.removeListener(storageListener);
  }

  public channelUrl(channel: IChannel) {
    return channel.handle ? `https://www.youtube.com${channel.handle}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(channel.name)}`;
  }

  private async save(channels: IChannel[]) {
    await chrome.storage.local.set({ [this.STORAGE_KEY]: channels });
  }
}

export default new ChannelBlacklistService();
