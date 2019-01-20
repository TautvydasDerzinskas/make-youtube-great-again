import IContent from '../../interfaces/content';

class ContentCustomProgressBar implements IContent {
  public extendPageUserInterface() {
    document.getElementsByTagName('body')[0]
      .classList.add('myga--custom-bar');

    this.addIndicatorBackgroundImageStyle();
  }

  public cleanUp() {
    document.getElementsByTagName('body')[0]
      .classList.remove('myga--custom-bar');
  }

  private addIndicatorBackgroundImageStyle() {
    const previousIndicatorStyle = document.querySelector('[name="myga-custom-bar"]');
    if (previousIndicatorStyle) {
      previousIndicatorStyle.remove();
    }

    const style = document.createElement('link');
    style.setAttribute('name', 'myga-custom-bar');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', chrome.extension.getURL(`/css/bars/bar__nyan-cat.css`));
    document.getElementsByTagName('head')[0].appendChild(style);
  }
}

export default new ContentCustomProgressBar();
