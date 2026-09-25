import IContent from '../../interfaces/content';

import './styles/hide-thanks.scss';

class ContentHideThanks implements IContent {
  public extendPageUserInterface() {
    document.body.classList.add('myga-hidden-thanks');
  }

  public cleanUp() {
    document.body.classList.remove('myga-hidden-thanks');
  }
}

export default new ContentHideThanks();
