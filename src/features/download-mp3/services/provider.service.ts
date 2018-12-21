import featureStorageService from '../../../services/common/feature-storage.service';

export default class ProviderService {
  public static videoId = window.location.hash.substr(1);

  public static getYoutubeUrl() {
    return `https://www.youtube.com/watch?v=${this.videoId ? this.videoId : ''}`;
  }

  public static registerConvertion(featureId: string, passedVideoId?: string) {
    const videoId = passedVideoId || this.videoId;

    if (videoId) {
      featureStorageService.trackVideo(featureId, videoId);
    }
  }
}
