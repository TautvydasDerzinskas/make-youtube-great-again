import { YoutubeSelectors } from '../../../enums';

class LooperService {
  public LOOPER_STATUS = false;

  get videoElement() {
    return document.querySelector(YoutubeSelectors.VideoPlayer) as HTMLVideoElement;
  }

  public toggle() {
    this.LOOPER_STATUS = !this.LOOPER_STATUS;

    if (this.videoElement) {
      this.videoElement.loop = this.LOOPER_STATUS;
    }
  }

  public reset() {
    if (this.LOOPER_STATUS && this.videoElement) {
      this.videoElement.loop = false;
    }
    this.LOOPER_STATUS = false;
  }
}

export default new LooperService();
