import './styles/hide-comments.scss';

import IContent from '../../interfaces/content';

class ContentHideComments implements IContent {
  public extendPageUserInterface() {
    document.getElementsByTagName('body')[0]
      .classList.add('myga-hidden-comments--enabled');
  }

  public cleanUp() {
    document.getElementsByTagName('body')[0]
    .classList.remove('myga-hidden-comments--enabled');
  }
}

export default new ContentHideComments();
