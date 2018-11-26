import { Selectors } from '../enums/selectorsEnums';

export default class UtilityService {
  constructor() {}

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

  public getYoutubeVideoName() {
    try {
      return document.querySelector(Selectors.YoutubeSongNameContainer)
        .textContent;
    } catch (e) {
      return `Couldn't retrieve the name of the clip`;
    }
  }
}
