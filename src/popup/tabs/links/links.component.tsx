import * as React from 'react';
import { Navigate } from 'react-router';

import LinkBoxComponent from './link-box/link-box.component';
import linksService, { ILink } from '../../../services/popup/links.service';

import './links.component.scss';

interface ILinksComponentState {
  links: ILink[];
  isLoaded: boolean;
}

/**
 * Built from links.json in the GitHub repository
 */
export default class LinksComponent extends React.Component<{}, ILinksComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = { links: [], isLoaded: false };
  }

  componentDidMount() {
    this.loadLinks();
  }

  private loadLinks() {
    linksService.getLinks().then(links => this.setState({ links: links || [], isLoaded: true }));
  }

  render() {
    // Couldn't be loaded: the tab is hidden, so back to the features
    if (this.state.isLoaded && this.state.links.length === 0) {
      return <Navigate to='/settings' replace />;
    }

    return (
      <div className='links'>
        {this.state.links.map(link => <LinkBoxComponent key={link.label + link.url} link={link} />)}
      </div>
    );
  }
}
