import { AUDIO_MODE_STATE_EVENT, IAudioModeState } from './audio-mode.events';

/**
 * Runs in the page's own world (not the isolated content script world),
 * because YouTube™'s player API only exists there
 */
interface IYoutubePlayer extends HTMLElement {
  getVideoData(): { video_id: string };
  getPlaybackQuality(): string;
  setPlaybackQualityRange(min: string, max: string): void;
  getCurrentTime(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  addEventListener(event: string, listener: (value: any) => void): void;
}

/**
 * 144p: audio is a separate stream, so its quality stays the same
 */
const AUDIO_MODE_QUALITY = 'tiny';

/**
 * YouTube™ stores the chosen quality here as the user's preference for all videos
 */
const QUALITY_PREFERENCE_KEY = 'yt-player-quality';
const PREFERENCE_RESTORE_TIMEOUT = 10000;
const QUALITY_CHECK_INTERVAL = 250;

const ACTIVE_CLASS = 'myga-audio-mode--active';
const OVERLAY_CLASS = 'myga-audio-mode-overlay';

class AudioModePage {
  private state: IAudioModeState = { enabled: false, audioTracks: [] };
  private audioModeVideoId: string = null;
  private qualityForcedVideoId: string = null;
  private hookedPlayer: IYoutubePlayer = null;
  private savedPreference: string = null;
  private hasSavedPreference = false;
  private restoreTimer: ReturnType<typeof setInterval>;

  constructor() {
    document.addEventListener(AUDIO_MODE_STATE_EVENT, (event: CustomEvent<string>) => {
      this.state = JSON.parse(event.detail);
      this.sync();
    });
    document.addEventListener('yt-navigate-finish', () => this.sync());
    document.addEventListener('yt-player-updated', () => this.sync());
    // Leaving or closing the page before 144p kicked in must not leave it as the user's preference
    window.addEventListener('pagehide', () => this.restorePreference());
  }

  get player(): IYoutubePlayer {
    const player = document.getElementById('movie_player') as IYoutubePlayer;
    return player && typeof player.setPlaybackQualityRange === 'function' ? player : null;
  }

  private sync() {
    const player = this.player;
    if (!player) {
      return;
    }
    this.hookPlayer(player);

    const videoData = player.getVideoData();
    const videoId = videoData && videoData.video_id;
    if (!videoId) {
      return;
    }

    const shouldPlayAsAudio = this.state.enabled && this.state.audioTracks.includes(videoId);

    if (shouldPlayAsAudio) {
      if (this.audioModeVideoId !== videoId) {
        this.startAudioMode(player, videoId);
      }
      this.forceAudioQuality(player);
    } else if (!shouldPlayAsAudio && this.audioModeVideoId === videoId) {
      this.stopAudioMode(player);
    } else if (!shouldPlayAsAudio && this.audioModeVideoId) {
      // Another video (or an ad) loaded: the forced quality doesn't carry over to it
      this.audioModeVideoId = null;
      this.qualityForcedVideoId = null;
      this.removeOverlay(player);
      this.restorePreference();
    }
  }

  private hookPlayer(player: IYoutubePlayer) {
    if (this.hookedPlayer === player) {
      return;
    }
    this.hookedPlayer = player;

    // Fires as soon as the next video starts loading, before the rest of the page is ready
    player.addEventListener('onStateChange', () => this.sync());
    player.addEventListener('onPlaybackQualityChange', () => this.sync());
  }

  private startAudioMode(player: IYoutubePlayer, videoId: string) {
    this.audioModeVideoId = videoId;
    this.qualityForcedVideoId = null;
    this.showOverlay(player, videoId);
  }

  private forceAudioQuality(player: IYoutubePlayer) {
    // Changing quality before the player's first load stalls it: retried on its next event
    if (this.qualityForcedVideoId === this.audioModeVideoId || player.getPlaybackQuality() === 'unknown') {
      return;
    }
    this.qualityForcedVideoId = this.audioModeVideoId;

    // The player reloads the stream reading the stored preference, so it can only be put back
    // once 144p is playing (the player doesn't reliably report quality changes made by code)
    this.savePreference();
    player.setPlaybackQualityRange(AUDIO_MODE_QUALITY, AUDIO_MODE_QUALITY);

    const startedAt = Date.now();
    clearInterval(this.restoreTimer);
    this.restoreTimer = setInterval(() => {
      if (player.getPlaybackQuality() === AUDIO_MODE_QUALITY || Date.now() - startedAt > PREFERENCE_RESTORE_TIMEOUT) {
        this.restorePreference();
      }
    }, QUALITY_CHECK_INTERVAL);
  }

  private stopAudioMode(player: IYoutubePlayer) {
    const time = player.getCurrentTime();

    this.audioModeVideoId = null;
    this.removeOverlay(player);

    if (!this.qualityForcedVideoId) {
      return;
    }
    this.qualityForcedVideoId = null;

    this.savePreference();
    player.setPlaybackQualityRange('auto', 'auto');
    this.restorePreference();

    // Drops the buffered 144p video, so the real quality shows right away
    player.seekTo(time, true);
  }

  private savePreference() {
    if (!this.hasSavedPreference) {
      this.savedPreference = localStorage.getItem(QUALITY_PREFERENCE_KEY);
      this.hasSavedPreference = true;
    }
  }

  private restorePreference() {
    clearInterval(this.restoreTimer);
    if (!this.hasSavedPreference) {
      return;
    }

    if (this.savedPreference === null) {
      localStorage.removeItem(QUALITY_PREFERENCE_KEY);
    } else {
      localStorage.setItem(QUALITY_PREFERENCE_KEY, this.savedPreference);
    }
    this.hasSavedPreference = false;
  }

  /**
   * Built with DOM APIs: YouTube™ enforces Trusted Types, so innerHTML throws in the page's world
   */
  private showOverlay(player: IYoutubePlayer, videoId: string) {
    this.removeOverlay(player);

    const artworkUrl = `url("https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg")`;

    const overlay = document.createElement('div');
    overlay.className = OVERLAY_CLASS;

    const backdrop = document.createElement('div');
    backdrop.className = `${OVERLAY_CLASS}__backdrop`;
    backdrop.style.backgroundImage = artworkUrl;

    const artwork = document.createElement('div');
    artwork.className = `${OVERLAY_CLASS}__artwork`;
    artwork.style.backgroundImage = artworkUrl;

    const label = document.createElement('div');
    label.className = `${OVERLAY_CLASS}__label`;
    label.appendChild(this.createHeadphonesIcon());
    label.appendChild(document.createTextNode('Audio mode'));

    overlay.append(backdrop, artwork, label);

    const videoContainer = player.querySelector('.html5-video-container');
    player.insertBefore(overlay, videoContainer ? videoContainer.nextSibling : player.firstChild);
    player.classList.add(ACTIVE_CLASS);
  }

  private removeOverlay(player: IYoutubePlayer) {
    player.classList.remove(ACTIVE_CLASS);
    player.querySelectorAll(`.${OVERLAY_CLASS}`).forEach(overlay => overlay.remove());
  }

  private createHeadphonesIcon() {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M12 3a9 9 0 0 0-9 9v7a2 2 0 0 0 2 2h3v-8H5v-1a7 7 0 0 1 14 0v1h-3v8h3a2 2 0 0 0 2-2v-7a9 9 0 0 0-9-9z');
    svg.appendChild(path);
    return svg;
  }
}

export default new AudioModePage();
