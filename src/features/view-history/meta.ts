import IMeta from '../../interfaces/meta';
import { IBaseSongsFeatureData } from '../../interfaces/feature';

const meta: IMeta<IBaseSongsFeatureData> = {
  id: 'myga-view-history',
  description: 'Remembers the videos you watch',
  title: 'Viewing history',
  defaultData: {
    counter: 0,
    songs: [],
  },
  videoPageOnly: true,
  isInHistoryTab: true,
  alwaysOn: true,
  actionTitle: 'viewed',
};

export default meta;
