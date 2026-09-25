import * as React from 'react';
import Tooltip from '../tooltip/tooltip.component';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

import NavigationComponent from './navigation/navigation.component';

import particlesConfig from './particles.config';
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
          <ParticlesProvider init={loadSlim}>
            <Particles id='header-particles' className='header__particles' options={particlesConfig} />
          </ParticlesProvider>
          <div className='header__logo__image image--logo' style={{ backgroundImage: 'url(./images/header2.webp)' }}></div>
          <NavigationComponent />
        </div>
        <div className='header__close-button' onClick={this.closePopup}>
          <Tooltip title='Close popup' position='bottom'>
            <svg><use xlinkHref='#myga-close'></use></svg>
          </Tooltip>
        </div>
      </div>
    );
  }
}
