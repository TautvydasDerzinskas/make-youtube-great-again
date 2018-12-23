

import * as React from 'react';
import LinkBoxComponent from './link-box/link-box.component';
import PaypalLinkBoxComponent from './paypal-link-box/paypal-link-box.component';

import { ShareLinks } from '../../../enums';
import IRepositoryData from '../../../interfaces/repo-data';

import './links.component.scss';

export default class LinksComponent extends React.Component<{}, { chromeStoreUrl: string; }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      chromeStoreUrl: null
    };
  }

  componentDidMount() {
    fetch(`https://raw.githubusercontent.com/SlimDogs/make-youtube-great-again/master/data.json`)
      .then(res => res.json())
      .then((result: IRepositoryData) => {
        this.setState({
          chromeStoreUrl: result.chromeStoreUrl,
        });
      }).catch((error) => {
        console.log('Data file does not exist', error);
      });
  }

  render() {
    let reviewLinkBox;
    if (this.state.chromeStoreUrl) {
      reviewLinkBox = (
        <LinkBoxComponent
          link={this.state.chromeStoreUrl}
          position='bottom-left-right'
          icon='star.svg'
          label='Love this extension? Leave a review!' />
      );
    }

    const shareLink = this.state.chromeStoreUrl || (window as any).myga.homepage;

    return (
      <div className='links'>
        <div className='links__column'>
          <LinkBoxComponent
            link={(window as any).myga.homepage}
            position='top-left'
            icon='github.svg'
            label='GitHub repository' />
          <LinkBoxComponent
            link={(window as any).myga.bugs}
            position='top-right'
            icon='report_bug.svg'
            label='Report a bug' />
          <LinkBoxComponent
            link={(window as any).myga.authorPage}
            position='bottom-left'
            icon='author.jpg'
            label='Extension author' />
          <PaypalLinkBoxComponent
            position='bottom-right'
            icon='beer.svg'
            label='Buy author a beer' />
        </div>
        <div className='links__column'>
        <LinkBoxComponent
            link={ShareLinks.Facebook + shareLink}
            position='top-left'
            icon='facebook.svg'
            label='Share to Facebook' />
          <LinkBoxComponent
            link={ShareLinks.Twitter + shareLink}
            position='top-right'
            icon='twitter.svg'
            label='Share to Twitter' />
          {reviewLinkBox}
        </div>
      </div>
    );
  }
}
