import * as React from 'react';
import { NavLink } from 'react-router';

const tabClassName = ({ isActive }: { isActive: boolean }) => `tabs__tab${isActive ? ' tab--active' : ''}`;

import './navigation.component.scss';

export default class NavigationComponent extends React.Component<{}> {
  render() {
    return (
      <div className='tabs'>
        <NavLink className={tabClassName} title='Features' to='/settings'>
          <span>Features</span>
        </NavLink>
        <NavLink end className={tabClassName} title='History' to='/history'>
          <span>History</span>
        </NavLink>
        <NavLink end className={tabClassName} title='Links' to='/links'>
          <span>Links</span>
        </NavLink>
        <div className='tabs__version' title={`Extension version v${(window as any).myga.version}`}>v{(window as any).myga.version}</div>
      </div>
    );
  }
}
