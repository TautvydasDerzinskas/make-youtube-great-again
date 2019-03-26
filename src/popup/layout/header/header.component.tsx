

import * as React from 'react';
import { Tooltip } from 'react-tippy';
import Particles from 'react-particles-js';

import NavigationComponent from './navigation/navigation.component';

import particlesConfig from './particles.config.json';
import './header.component.scss';

export default class HeaderComponent extends React.Component<{}> {
  private closePopup() {
    window.close();
  }

  render() {
    return (
      <div className='layout__header'>
        <div className='header__logo'>
          <div className='header__logo__image image--background' style={{ backgroundImage: 'url(./images/header.webp)' }}></div>
          <Particles className='header__particles' width='100%' height='100%' params={particlesConfig} />
          <div className='header__logo__image image--logo' style={{ backgroundImage: 'url(./images/header2.webp)' }}></div>
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
