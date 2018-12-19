import './styles/hide-comments.scss';

import IContent from '../../interfaces/content';

class ContentHideComments implements IContent {
  public extendPageUserInterface(): Promise<boolean> {
    return new Promise((resolve) => {
      document.getElementsByTagName('body')[0].classList.add('myga-hidden-comments--enabled');
      resolve();
    });
  }

  public setupEventListeners(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  public setupCommunications(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

export default new ContentHideComments();
