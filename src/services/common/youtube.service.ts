export default class YoutubeService {
  public isActiveTabYoutubeVideo(url: string) {
    return this.isActiveTabYoutube(url) && url.toLowerCase().indexOf('watch?') >= 0;
  }

  public isActiveTabYoutube(url: string) {
    if (url) {
      url = url.toLowerCase();
      return url.indexOf('http') === 0 && url.indexOf('youtube') >= 0;
    }

    return false;
  }
}
