import * as React from 'react';
import Tooltip from '../../../../layout/tooltip/tooltip.component';

import { IVideoInfo } from '../../../../../services/common/video-info.service';

import './video.component.scss';

export default class VideoComponent extends React.Component<{ video: IVideoInfo }, {}> {

  render() {
    return (
      <Tooltip title='Open' position='top'>
        <a className='video' href={'https://www.youtube.com/watch?v=' + this.props.video.id} target='_blank'>
          <span className='video__thumbnail'>
            <img height='30px' src={this.props.video.thumbnailUrl} alt='' />
          </span>
          <span className='video__title'>{this.props.video.title}</span>
          <span className='video__play-button'>
            <img className='play-button--active' src='icons/icon_19x19.png' height='10px' width='10px' />
            <img className='play-button--disabled' src='icons/icon_disabled_19x19.png' height='10px' width='10px' />
          </span>
        </a>
      </Tooltip>
    );
  }
}
