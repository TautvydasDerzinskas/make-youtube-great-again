import svgIconsService from '../../services/content/svg-icons.service';

import {
  AUDIO_MODE_PLAYLIST_REQUEST_EVENT,
  AUDIO_MODE_PLAYLIST_RESPONSE_EVENT,
  IPlaylistVideosRequest,
  IPlaylistVideosResponse,
} from './audio-mode.events';

const BUTTON_CLASS = 'myga-playlist-audio-btn';
const REQUEST_TIMEOUT = 60000;

/**
 * Button after "Shuffle" in the playlist panel, marking all the playlist's videos as audio
 */
export default class PlaylistAudioModeButton {
  private listId: string = null;
  private videoIds: string[] = null;
  private error: string = null;
  private isMarking = false;
  private panelObserver: MutationObserver;

  constructor(
    private getAudioTracks: () => string[],
    private markAll: (videoIds: string[]) => Promise<void>,
  ) {}

  public attach(listId: string) {
    // Mixes ("RD…") are endless, auto-generated lists
    if (!listId || listId.startsWith('RD')) {
      this.detach();
      return;
    }

    if (listId !== this.listId) {
      this.detach();
      this.listId = listId;
      this.requestVideoIds(listId);
    }

    // The panel renders late & re-renders when moving between videos
    if (!this.panelObserver) {
      this.panelObserver = new MutationObserver(() => this.insertButtons());
      this.panelObserver.observe(document.querySelector('ytd-watch-flexy') || document.body, { childList: true, subtree: true });
    }
    this.insertButtons();
  }

  public detach() {
    if (this.panelObserver) {
      this.panelObserver.disconnect();
      this.panelObserver = null;
    }
    document.querySelectorAll(`.${BUTTON_CLASS}`).forEach(button => button.remove());

    this.listId = null;
    this.videoIds = null;
    this.error = null;
    this.isMarking = false;
  }

  public update() {
    document.querySelectorAll<HTMLButtonElement>(`.${BUTTON_CLASS}`).forEach(button => this.render(button));
  }

  private insertButtons() {
    // Same group as the playlist's "Loop" & "Shuffle" buttons, right after them
    document.querySelectorAll('ytd-playlist-panel-renderer #playlist-action-menu #top-level-buttons-computed').forEach(buttonsGroup => {
      const last = buttonsGroup.lastElementChild;
      if (last && last.classList.contains(BUTTON_CLASS)) {
        return;
      }
      buttonsGroup.querySelectorAll(`.${BUTTON_CLASS}`).forEach(button => button.remove());

      const $button = document.createElement('button');
      $button.className = `myga-action-btn ${BUTTON_CLASS} ytSpecButtonShapeNextHost ytSpecButtonShapeNextText ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeM ytSpecButtonShapeNextIconButton`;
      $button.setAttribute('type', 'button');
      $button.innerHTML = `<div class="ytSpecButtonShapeNextIcon">${svgIconsService.iconHeadphones}</div>`;
      $button.addEventListener('click', (event: Event) => {
        // The panel header collapses the playlist when clicked
        event.stopPropagation();
        this.onClick();
      });

      buttonsGroup.appendChild($button);
      this.render($button);
    });
  }

  private get unmarkedVideoIds() {
    const audioTracks = new Set(this.getAudioTracks());
    return this.videoIds ? this.videoIds.filter(videoId => !audioTracks.has(videoId)) : [];
  }

  private render($button: HTMLButtonElement) {
    let title: string;
    let isComplete = false;

    if (this.error) {
      title = `Couldn't load this playlist's videos: ${this.error}`;
    } else if (!this.videoIds || this.isMarking) {
      title = 'Loading playlist videos…';
    } else if (this.unmarkedVideoIds.length === 0) {
      isComplete = true;
      title = `All ${this.videoIds.length} videos in this playlist play as audio`;
    } else {
      title = `Play all ${this.videoIds.length} videos in this playlist as audio (${this.unmarkedVideoIds.length} not yet)`;
    }

    const isDisabled = isComplete || Boolean(this.error) || !this.videoIds || this.isMarking;

    $button.classList.toggle('myga-action-btn--active', isComplete);
    $button.classList.toggle(`${BUTTON_CLASS}--loading`, !this.error && (!this.videoIds || this.isMarking));
    $button.setAttribute('aria-disabled', String(isDisabled));
    $button.setAttribute('aria-label', title);
    $button.setAttribute('title', title);
  }

  private onClick() {
    const unmarkedVideoIds = this.unmarkedVideoIds;
    if (this.isMarking || unmarkedVideoIds.length === 0) {
      return;
    }

    this.isMarking = true;
    this.update();
    this.markAll(unmarkedVideoIds).finally(() => {
      this.isMarking = false;
      this.update();
    });
  }

  private requestVideoIds(listId: string) {
    const requestId = `${listId}-${Date.now()}-${Math.random()}`;

    const onResponse = (event: CustomEvent<string>) => {
      const response: IPlaylistVideosResponse = JSON.parse(event.detail);
      if (response.requestId !== requestId) {
        return;
      }
      finish();

      if (this.listId === listId) {
        this.videoIds = response.videoIds || null;
        this.error = response.error || null;
        this.update();
      }
    };

    const timeout = setTimeout(() => {
      finish();
      if (this.listId === listId && !this.videoIds) {
        this.error = 'timed out';
        this.update();
      }
    }, REQUEST_TIMEOUT);

    const finish = () => {
      clearTimeout(timeout);
      document.removeEventListener(AUDIO_MODE_PLAYLIST_RESPONSE_EVENT, onResponse);
    };

    document.addEventListener(AUDIO_MODE_PLAYLIST_RESPONSE_EVENT, onResponse);

    const request: IPlaylistVideosRequest = { requestId, listId };
    document.dispatchEvent(new CustomEvent(AUDIO_MODE_PLAYLIST_REQUEST_EVENT, { detail: JSON.stringify(request) }));
  }
}
