import * as React from 'react';
import { NavLink } from 'react-router-dom';

import './navigation.component.scss';

export default class NavigationComponent extends React.Component<{}> {

  render() {
    return (
      <div className='tabs'>
        <NavLink exact className='tabs__tab' activeClassName='tab--active' to='/'>Extension</NavLink>
        <NavLink exact className='tabs__tab' activeClassName='tab--active' to='/settings'>Settings</NavLink>
        <NavLink exact className='tabs__tab' activeClassName='tab--active' to='/about'>About</NavLink>
      </div>
    );
  }
}
