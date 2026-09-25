/**
 * Set in local storage once sync storage failed, so every part of the extension
 * (popup, content scripts, background) keeps reading & writing the same place
 */
const USE_LOCAL_STORAGE_KEY = 'mygaUseLocalStorage';

let useLocalStorage: Promise<boolean> = null;

/**
 * Prefers sync storage (settings follow the user across browsers) & falls back to
 * local storage when sync fails: disabled by policy, quota exceeded, or unavailable
 */
export default class BrowserStorageService {
  public async getItem<T>(storageKey: string): Promise<T> {
    const area = await this.getArea();
    try {
      const result = await area.get(storageKey);
      return this.convertToJson<T>(result[storageKey] as string);
    } catch (error) {
      if (area === chrome.storage.sync) {
        await this.switchToLocalStorage(error);
        return this.getItem<T>(storageKey);
      }
      throw error;
    }
  }

  public async setItem<T>(storageKey: string, data: T): Promise<boolean> {
    const area = await this.getArea();
    try {
      await area.set({ [storageKey]: this.convertToString<T>(data) });
      return true;
    } catch (error) {
      if (area === chrome.storage.sync) {
        await this.switchToLocalStorage(error);
        return this.setItem<T>(storageKey, data);
      }
      throw error;
    }
  }

  public convertToString<T>(jsonItem: T) {
    return JSON.stringify(jsonItem, null, 0);
  }

  public convertToJson<T>(stringifiedObject: string): T {
    try {
      return JSON.parse(stringifiedObject);
    } catch {
      return null;
    }
  }

  private async getArea(): Promise<chrome.storage.StorageArea> {
    if (!useLocalStorage) {
      useLocalStorage = chrome.storage.local.get(USE_LOCAL_STORAGE_KEY)
        .then(result => Boolean(result[USE_LOCAL_STORAGE_KEY]), () => false);

      // Another part of the extension may switch later
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes[USE_LOCAL_STORAGE_KEY]) {
          useLocalStorage = Promise.resolve(Boolean(changes[USE_LOCAL_STORAGE_KEY].newValue));
        }
      });
    }

    return (await useLocalStorage) ? chrome.storage.local : chrome.storage.sync;
  }

  private async switchToLocalStorage(error: unknown) {
    console.warn('[MYGA] Sync storage unavailable, using local storage instead:', error);
    useLocalStorage = Promise.resolve(true);

    // When only writing failed (e.g. its write rate limit), the settings are still readable: keep them
    try {
      const syncedItems = await chrome.storage.sync.get(null);
      const localItems = await chrome.storage.local.get(Object.keys(syncedItems));
      const missingItems = Object.fromEntries(Object.entries(syncedItems).filter(([key]) => !(key in localItems)));
      await chrome.storage.local.set(missingItems);
    } catch {
      // Sync storage not readable either: defaults get filled in
    }

    await chrome.storage.local.set({ [USE_LOCAL_STORAGE_KEY]: true });
  }
}
