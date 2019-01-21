

import * as React from 'react';
import { Tooltip } from 'react-tippy';

import NavigationComponent from './navigation/navigation.component';

import './header.component.scss';

export default class HeaderComponent extends React.Component<{}> {
  private closePopup() {
    window.close();
  }

  render() {
    return (
      <div className='layout__header'>
        <div className='header__logo'>
          <div className='header__logo__image' style={{ backgroundImage: 'url(./images/header.png)', }}></div>
          <div className='header__logo__image' style={{ backgroundImage: 'url(./images/header2.png)', }}></div>
          <NavigationComponent />
        </div>
        <div className='header__close-button' onClick={this.closePopup}>
          <Tooltip title='Close popup' arrow={true} position='bottom'>
            <svg><use xlinkHref='#myga-close'></use></svg>
          </Tooltip>
        </div>
      </div>
    );
  }
}
