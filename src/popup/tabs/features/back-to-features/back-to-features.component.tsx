import * as React from 'react';
import { Tooltip } from 'react-tippy';
import { NavLink } from 'react-router-dom';


import './back-to-features.component.scss';

interface IBackToFeaturesComponentProps {
  featureName: string;
}

export default class BackToFeaturesComponent extends React.Component<IBackToFeaturesComponentProps> {

  render() {
    return (
      <div className='back-to-features'>
        <div>
          <svg><use xlinkHref='#myga-settings'></use></svg>
          <span>{this.props.featureName}</span>
        </div>
        <div>
          <Tooltip title='Back to the Features tab' arrow={true} position='top'>
            <NavLink to='/settings'>
              <svg><use xlinkHref='#myga-arrow-left'></use></svg>
              <span>Back to Features</span>
            </NavLink>
          </Tooltip>
        </div>
      </div>
    );
  }
}
