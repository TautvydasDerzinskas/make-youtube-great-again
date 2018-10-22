export default class UtilityService {
  public getQueryParameterByName(name: string, url: string) {
    name = name.replace(/[\[\]]/g, '\\$&');

    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);

    if (!results) {
      return null;
    } else if (!results[2]) {
      return '';
    } else {
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  }

  public getYoutubeClipName() {
    const infoBlockElement = document.getElementById('info-contents');

    try {
      return infoBlockElement
        .childNodes[0]
        .childNodes[0]
        .childNodes[3]
        .childNodes[0]
        .textContent;
    } catch (e) {
      return `Couldn't retrieve the name of the clip`;
    }
  }
}
