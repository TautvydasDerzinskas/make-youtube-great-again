import audioTracksService from './services/audio-tracks.service';
import PlaylistAudioModeButton from './playlist-button';
import actionButtonService from '../../services/content/action-button.service';
import urlService from '../../services/common/url.service';

import iconHeadphones from '../../assets/vectors/headphones.svg';

import IContent from '../../interfaces/content';
import { AUDIO_MODE_STATE_EVENT, IAudioModeState } from './audio-mode.events';

import '../../services/content/action-button.scss';
import './styles/audio-mode.scss';

class ContentAudioMode implements IContent {
  private buttonsObserver: MutationObserver;
  private audioTracks: string[] = [];
  private removeStorageListener: () => void;
  private playlistButton = new PlaylistAudioModeButton(
    () => this.audioTracks,
    videoIds => audioTracksService.markAll(videoIds),
  );

  get audioModeButton() {
    return document.getElementsByClassName('myga-audio-mode-btn')[0] as HTMLButtonElement;
  }

  get isVideoMarked() {
    return this.audioTracks.includes(urlService.getQueryParameterByName('v'));
  }

  public extendPageUserInterface() {
    // Not cleanUp(): switching audio mode off & on again between videos would reload the stream
    this.removeButton();

    const $button = actionButtonService.create(
      'myga-audio-mode-btn',
      'Audio',
      iconHeadphones,
      'Always play this video as audio only',
      'Play this video with video again',
    );
    this.buttonsObserver = actionButtonService.attach($button);

    this.playlistButton.attach(urlService.getQueryParameterByName('list'));

    // Marking from the playlist button or another tab updates everything
    if (!this.removeStorageListener) {
      this.removeStorageListener = audioTracksService.onChange(audioTracks => {
        this.audioTracks = audioTracks;
        this.updateState();
      });
    }

    audioTracksService.getAll().then(audioTracks => {
      this.audioTracks = audioTracks;
      this.updateState();
    });
  }

  public setupEventListeners() {
    this.audioModeButton.addEventListener('click', () => {
      const videoId = urlService.getQueryParameterByName('v');

      // The storage listener updates the state
      audioTracksService.toggle(videoId);
    });
  }

  public cleanUp() {
    this.removeButton();
    this.playlistButton.detach();

    if (this.removeStorageListener) {
      this.removeStorageListener();
      this.removeStorageListener = null;
    }
    this.sendStateToPage({ enabled: false, audioTracks: [] });
  }

  private updateState() {
    if (this.audioModeButton) {
      actionButtonService.setActive(this.audioModeButton, this.isVideoMarked);
    }
    this.playlistButton.update();
    this.sendStateToPage({ enabled: true, audioTracks: this.audioTracks });
  }

  /**
   * Received by page.ts, which switches the quality & shows the overlay
   */
  private sendStateToPage(state: IAudioModeState) {
    document.dispatchEvent(new CustomEvent(AUDIO_MODE_STATE_EVENT, { detail: JSON.stringify(state) }));
  }

  private removeButton() {
    if (this.buttonsObserver) {
      this.buttonsObserver.disconnect();
      this.buttonsObserver = null;
    }

    const $buttons = document.getElementsByClassName('myga-audio-mode-btn');
    while ($buttons.length > 0) {
      $buttons[0].remove();
    }
  }
}

export default new ContentAudioMode();
