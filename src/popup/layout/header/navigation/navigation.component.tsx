import * as React from 'react';
import { NavLink } from 'react-router';

import linksService from '../../../../services/popup/links.service';

const tabClassName = ({ isActive }: { isActive: boolean }) => `tabs__tab${isActive ? ' tab--active' : ''}`;

import './navigation.component.scss';

interface INavigationComponentState {
  showLinks: boolean;
}

export default class NavigationComponent extends React.Component<{}, INavigationComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = { showLinks: false };
  }

  /**
   * Only once links.json loaded
   */
  componentDidMount() {
    this.updateLinksTab();
  }

  private updateLinksTab() {
    linksService.getLinks().then(links => this.setState({ showLinks: Boolean(links && links.length) }));
  }

  render() {
    return (
      <div className='tabs'>
        <NavLink className={tabClassName} title='Features' to='/settings'>
          <span>Features</span>
        </NavLink>
        <NavLink end className={tabClassName} title='History' to='/history'>
          <span>History</span>
        </NavLink>
        {this.state.showLinks && <NavLink end className={tabClassName} title='Links' to='/links'>
          <span>Links</span>
        </NavLink>}
        <div className='tabs__version' title={`Extension version v${(window as any).myga.version}`}>v{(window as any).myga.version}</div>
      </div>
    );
  }
}
