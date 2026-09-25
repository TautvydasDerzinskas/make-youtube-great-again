import * as React from 'react';
import VideoComponent from './video/video.component';

import featureStorageService from '../../../../services/common/feature-storage.service';
import formatService from '../../../../services/common/format.service';
import videoInfoService, { IVideoInfo } from '../../../../services/common/video-info.service';

import IMeta from '../../../../interfaces/meta';
import { IBaseSongsFeatureData } from '../../../../interfaces/feature';

import './feature-stats-group.component.scss';

interface IFeatureStatsGroupComponentState {
  videos: IVideoInfo[];
  counter: number;
}

interface IFeatureStatsGroupComponentProps {
  meta: IMeta<IBaseSongsFeatureData>;
}

export default class FeatureStatsGroupComponent extends React.Component<IFeatureStatsGroupComponentProps, IFeatureStatsGroupComponentState> {
  constructor(props: IFeatureStatsGroupComponentProps) {
    super(props);
    this.state = {
      videos: [],
      counter: 0,
    };
  }

  componentDidMount() {
    featureStorageService.getFeatureData<IBaseSongsFeatureData>(this.props.meta.id).then(async featureData => {
      const data = featureData && featureData.data || {};
      const videoIds = data.songs || [];

      // Shown right away, titles fill in once loaded
      this.setState({
        counter: data.counter || 0,
        videos: videoIds.map(id => ({ id, title: '', thumbnailUrl: videoInfoService.getThumbnailUrl(id) })),
      });
      this.setState({ videos: await videoInfoService.getVideos(videoIds) });
    });
  }

  render() {
    let allVideoHtml: React.ReactNode = <div className='feature-group__none'>No videos tracked yet</div>;

    if (this.state.videos.length > 0) {
      allVideoHtml = this.state.videos.map(video =>
        <VideoComponent key={video.id} video={video}></VideoComponent>
      );
    }

    return (
      <div className='feature-group'>
        <div className='feature-group__heading'>
          <div className='feature-group__title'>
            Recently {this.props.meta.actionTitle}:
          </div>
          <div className='feature-group__sub-title'>
            Total <strong>{formatService.formatNumber(this.state.counter)}</strong> video(s) {this.props.meta.actionTitle}
          </div>
        </div>
        <div className='feature-group__videos'>{allVideoHtml}</div>
      </div>
    );
  }
}
