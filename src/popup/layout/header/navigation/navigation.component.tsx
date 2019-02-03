import * as React from 'react';
import { NavLink } from 'react-router-dom';

import './navigation.component.scss';

export default class NavigationComponent extends React.Component<{}> {
  render() {
    return (
      <div className='tabs'>
        <NavLink className='tabs__tab' activeClassName='tab--active' title='Features' to='/settings'>
          <span>Features</span>
        </NavLink>
        <NavLink exact className='tabs__tab' activeClassName='tab--active' title='History' to='/history'>
          <span>History</span>
        </NavLink>
        <NavLink exact className='tabs__tab' activeClassName='tab--active' title='Links' to='/links'>
          <span>Links</span>
        </NavLink>
        <div className='tabs__version' title={`Extension version v${(window as any).myga.version}`}>v{(window as any).myga.version}</div>
      </div>
    );
  }
}
