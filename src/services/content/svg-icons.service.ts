class SvgIconsService {
  get iconDownloadMp3() {
    return require('../../assets/vectors/download-mp3.svg');
  }

  get iconLooper() {
    return require('../../assets/vectors/looper.svg');
  }

  get iconProgress() {
    return require('../../assets/vectors/progress-pie.svg');
  }

  get iconThumb() {
    return require('../../assets/vectors/thumb.svg');
  }

  get iconPlay() {
    return require('../../assets/vectors/play.svg');
  }

  get iconPause() {
    return require('../../assets/vectors/pause.svg');
  }

  get iconPlus() {
    return require('../../assets/vectors/plus.svg');
  }

  get iconMinus() {
    return require('../../assets/vectors/minus.svg');
  }

  get iconClose() {
    return require('../../assets/vectors/close.svg');
  }
}

export default new SvgIconsService();
