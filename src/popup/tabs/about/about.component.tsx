

import * as React from 'react';
import LinkBoxComponent from './link-box/link-box.component';
import PaypalLinkBoxComponent from './paypal-link-box/paypal-link-box.component';

import './about.component.scss';

export default class AboutComponent extends React.Component<{}> {

  render() {
    return (
      <div className='about'>
        <div className='about__links'>
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
        <div className='about__author'>
        </div>
      </div>
    );
  }
}
