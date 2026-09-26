import IMeta from '../../interfaces/meta';
import channelBlacklistService from './services/channel-blacklist.service';

const meta: IMeta<{}> = {
  id: 'myga-channel-blacklist',
  description: 'Allows hiding videos of chosen channels',
  title: 'Channel blacklist',
  defaultStatus: true,
  isInHistoryTab: false,
  releaseDate: '2026-09-26',
  dataView: {
    title: 'Blacklisted channels',
    icon: 'myga-list',
    hasData: () => channelBlacklistService.getAll().then(channels => channels.length > 0),
    onChange: listener => channelBlacklistService.onChange(listener),
  },
};

export default meta;
