export default class YoutubeService {
  public isActiveTabYoutubeVideo(url: string) {
    return this.isActiveTabYoutube(url) && url.toLowerCase().includes('watch?');
  }

  public isActiveTabYoutube(url: string) {
    if (url) {
      url = url.toLowerCase();
      return url.indexOf('http') === 0 && url.includes('youtube');
    }

    return false;
  }
}
