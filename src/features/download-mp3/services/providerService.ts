export default class ProviderService {
  public static getYoutubeUrl() {
    const videoId = window.location.hash.substr(1);
    return `https://www.youtube.com/watch?v=${videoId ? videoId : ''}`;
  }
}
