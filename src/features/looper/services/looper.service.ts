import { YoutubeSelectors } from '../../../enums';

class LooperService {
  public LOOPER_STATUS = false;

  private FLASH_PLAYER: any = null;
  private HTML5_PLAYER: any = null;

  private LOOPER_TIMER: any = null;

  public toggle() {
    this.setPlayer();

    this.LOOPER_STATUS = !this.LOOPER_STATUS;

    if (this.LOOPER_STATUS) {

      if (this.FLASH_PLAYER) {
        this.LOOPER_TIMER = setInterval(this.performLooping.bind(this), 500);
      } else {
        document.querySelector(YoutubeSelectors.VideoPlayer).setAttribute('loop', '1');
      }

    } else {

      if (this.FLASH_PLAYER) {
        clearInterval(this.LOOPER_TIMER);
      } else {
        document.querySelector(YoutubeSelectors.VideoPlayer).removeAttribute('loop');
      }

    }
  }

  private setPlayer() {
    if (!this.FLASH_PLAYER && !this.HTML5_PLAYER) {
      const player: any = document.getElementById('movie_player');

      if (player && player.type && player.type.indexOf('flash') !== -1) {
          this.FLASH_PLAYER = player;
      } else {
        this.HTML5_PLAYER = document.querySelector(YoutubeSelectors.VideoPlayer);
      }
    }
  }

  private performLooping() {
    if (this.LOOPER_STATUS && this.FLASH_PLAYER.getPlayerState() === 0) {
      this.FLASH_PLAYER.seekTo(0, true);
      this.FLASH_PLAYER.pauseVideo();
      this.FLASH_PLAYER.playVideo();
    }
  }
}

export default new LooperService();
