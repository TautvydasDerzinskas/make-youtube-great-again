export default class ProviderSaveMp3 {
  public static NAME = 'Save-Mp3';
  public static URL = 'https://savemp3.net/frame/button/?quality=320&video=';

  public static initialize() {
    if (window.location.href.toLowerCase().includes(this.URL)) {
      // TODO
    }
  }
}
