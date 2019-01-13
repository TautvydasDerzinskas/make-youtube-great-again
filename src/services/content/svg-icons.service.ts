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
}

export default new SvgIconsService();
