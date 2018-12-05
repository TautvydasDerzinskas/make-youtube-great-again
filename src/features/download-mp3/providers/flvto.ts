import ProviderService from '../services/providerService';

export default class ProviderFlvo {
  public static NAME = 'Flvto';
  public static URL = 'https://www.flvto.biz';

  public static initialize() {
    if (window.location.href.toLowerCase().includes(this.URL)) {
      (<HTMLInputElement>document.getElementById('convertUrl')).value = ProviderService.getYoutubeUrl();

      document.getElementsByTagName('button')[0].click();
    }
  }
}
