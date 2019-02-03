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
          <Tooltip title='Back to the Features tab' arrow={true} position='top'>
            <NavLink to='/settings'>
              <span>Features</span>
            </NavLink>
          </Tooltip>
          <svg><use xlinkHref='#myga-caret-right'></use></svg>
          <strong>{this.props.featureName}</strong>
        </div>
      </div>
    );
  }
}
