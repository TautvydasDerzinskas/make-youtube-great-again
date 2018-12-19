

import * as React from 'react';

import './extension.component.scss';

export default class ExtensionComponent extends React.Component<{}> {

  render() {
    return (
      <div className='tabs-content__content content--active'>
        Extension content...
      </div>
    );
  }
}
