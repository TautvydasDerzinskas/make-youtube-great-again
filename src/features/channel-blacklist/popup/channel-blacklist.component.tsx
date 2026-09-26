import * as React from 'react';
import { Navigate } from 'react-router';

import BackToFeaturesComponent from '../../../popup/tabs/features/settings/back-to-features/back-to-features.component';

import channelBlacklistService, { IChannel } from '../services/channel-blacklist.service';
import MetaChannelBlacklist from '../meta';

import './channel-blacklist.component.scss';

interface IChannelBlacklistComponentState {
  channels: IChannel[];
  isLoaded: boolean;
}

export default class ChannelBlacklistComponent extends React.Component<{}, IChannelBlacklistComponentState> {
  private removeStorageListener: () => void;

  constructor(props: {}) {
    super(props);
    this.state = { channels: [], isLoaded: false };
  }

  componentDidMount() {
    this.loadChannels();
    this.removeStorageListener = channelBlacklistService.onChange(() => this.loadChannels());
  }

  componentWillUnmount() {
    this.removeStorageListener();
  }

  private loadChannels() {
    channelBlacklistService.getAll().then(channels => this.setState({ channels, isLoaded: true }));
  }

  render() {
    // Nothing left (e.g. the last one removed): back to the features
    if (this.state.isLoaded && this.state.channels.length === 0) {
      return <Navigate to='/settings' replace />;
    }

    return (
      <>
        <BackToFeaturesComponent featureName={MetaChannelBlacklist.title} />
        <div className='cb-list'>
          {this.state.channels.map(channel => (
            <div className='cb-list__channel' key={channel.handle || channel.name}>
              <a className='cb-list__avatar' href={channelBlacklistService.channelUrl(channel)} target='_blank' title='Open the channel'>
                {channel.avatarUrl
                  ? <img src={channel.avatarUrl} alt='' />
                  : <span>{channel.name.charAt(0).toUpperCase()}</span>}
              </a>
              <a className='cb-list__details' href={channelBlacklistService.channelUrl(channel)} target='_blank' title='Open the channel'>
                <span className='cb-list__name'>{channel.name}</span>
                {channel.handle && <span className='cb-list__handle'>{channel.handle.replace(/^\//, '')}</span>}
              </a>
              <button type='button' className='cb-list__remove' onClick={() => channelBlacklistService.remove(channel)}>Remove</button>
            </div>
          ))}
        </div>
      </>
    );
  }
}
