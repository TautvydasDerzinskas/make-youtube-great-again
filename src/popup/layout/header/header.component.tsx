

import * as React from 'react';
import './header.component.scss';

export default class HeaderComponent extends React.Component<{}> {

  render() {
    return (
      <div className='layout__header'>
        <img src='images/header.png' />
      </div>
    );
  }
}
