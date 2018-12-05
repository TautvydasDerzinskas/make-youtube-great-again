import ProviderService from '../services/providerService';

export default class ProviderOnlineVideoConverter {
  public static NAME = 'OnlineVideoConverter';
  public static URL = 'https://www.onlinevideoconverter.com/youtube-converter';

  public static initialize() {
    if (window.location.href.toLowerCase().includes(this.URL)) {
      (<HTMLInputElement>document.getElementById('texturl')).value = ProviderService.getYoutubeUrl();

      const dropdownElements = document.querySelectorAll('[data-value]');
      for (let i = 0, b = dropdownElements.length; i < b; i += 1) {
        const value = dropdownElements[i].getAttribute('data-value');
        if (value === 'mp3' || value === '320') {
          dropdownElements[i].classList.add('active');
        } else {
          dropdownElements[i].classList.remove('active');
        }
      }

      document.getElementById('convert1').click();
    }
  }
}
