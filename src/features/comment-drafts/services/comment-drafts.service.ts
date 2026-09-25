export interface ICommentDraft {
  id: string;
  videoId: string;
  videoTitle: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

interface IPublishRequest {
  draftId: string;
  requestedAt: number;
}

/**
 * Shared by the content script & the popup. Local storage: drafts can be long & many,
 * the sync storage per-item quota (8KB) would soon be exceeded.
 */
class CommentDraftsService {
  private STORAGE_KEY = 'mygaCommentDrafts';

  /**
   * Set by the popup's "Publish", picked up by the video's tab it opens
   */
  private PUBLISH_REQUEST_KEY = 'mygaCommentDraftPublish';
  private PUBLISH_REQUEST_TIMEOUT = 2 * 60 * 1000;

  public async getAll(): Promise<ICommentDraft[]> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    const drafts = (result[this.STORAGE_KEY] as ICommentDraft[]) || [];
    return drafts.toSorted((a, b) => b.updatedAt - a.updatedAt);
  }

  public async getForVideo(videoId: string) {
    return (await this.getAll()).filter(draft => draft.videoId === videoId);
  }

  public async add(videoId: string, videoTitle: string, text: string) {
    const now = Date.now();
    const draft: ICommentDraft = { id: crypto.randomUUID(), videoId, videoTitle, text, createdAt: now, updatedAt: now };
    await this.save([draft, ...await this.getAll()]);
    return draft;
  }

  public async update(draftId: string, text: string) {
    const drafts = await this.getAll();
    await this.save(drafts.map(draft => draft.id === draftId ? { ...draft, text, updatedAt: Date.now() } : draft));
  }

  public async remove(draftId: string) {
    await this.save((await this.getAll()).filter(draft => draft.id !== draftId));
  }

  public async requestPublish(draftId: string) {
    const request: IPublishRequest = { draftId, requestedAt: Date.now() };
    await chrome.storage.local.set({ [this.PUBLISH_REQUEST_KEY]: request });
  }

  /**
   * Returns the draft to publish on this video, if the popup asked for it recently, and clears the request
   */
  public async takePublishRequest(videoId: string): Promise<ICommentDraft> {
    const result = await chrome.storage.local.get(this.PUBLISH_REQUEST_KEY);
    const request = result[this.PUBLISH_REQUEST_KEY] as IPublishRequest;
    if (!request || Date.now() - request.requestedAt > this.PUBLISH_REQUEST_TIMEOUT) {
      return null;
    }

    const draft = (await this.getAll()).find(item => item.id === request.draftId);
    if (!draft || draft.videoId !== videoId) {
      return null;
    }

    await chrome.storage.local.remove(this.PUBLISH_REQUEST_KEY);
    return draft;
  }

  /**
   * Called whenever drafts change, from any tab or the popup. Returns a function removing the listener.
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

  public formatAge(timestamp: number) {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) {
      return 'just now';
    }
    if (minutes < 60) {
      return `${minutes} min ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} h ago`;
    }
    return new Date(timestamp).toLocaleDateString();
  }

  private async save(drafts: ICommentDraft[]) {
    await chrome.storage.local.set({ [this.STORAGE_KEY]: drafts });
  }
}

export default new CommentDraftsService();
