import * as React from 'react';

import { ILink } from '../../../../services/popup/links.service';

import './link-box.component.scss';

export default class LinkBoxComponent extends React.Component<{ link: ILink }, {}> {

  private getIcon() {
    const icon = this.props.link.icon;

    if (icon.startsWith('https://')) {
      return <img src={icon} alt='' className='link-box__icon link-box__icon--image' />;
    }
    if (icon.endsWith('.svg')) {
      return (
        <svg className='link-box__icon'>
          <use xlinkHref={`vectors/${icon}#icon`}></use>
        </svg>
      );
    }
    return <img src={`images/${icon}`} alt='' className='link-box__icon link-box__icon--image' />;
  }

  render() {
    const { link } = this.props;

    return (
      <a href={link.url} target='_blank' rel='noopener noreferrer' title={link.label} className={`link-box${link.wide ? ' link-box--wide' : ''}`}>
        {this.getIcon()}
        <div className='link-box__overlay'>
          <span>{link.label}</span>
        </div>
      </a>
    );
  }
}
