import IMeta from '../../interfaces/meta';
import { IBaseSongsFeatureData } from '../../interfaces/feature';

const meta: IMeta<IBaseSongsFeatureData> = {
  id: 'myga-view-history',
  description: 'Lists the videos you watch in the History tab, most recent first',
  title: 'Viewing history',
  defaultData: {
    counter: 0,
    songs: [],
  },
  videoPageOnly: true,
  isInHistoryTab: true,
  actionTitle: 'viewed',
  releaseDate: '2026-09-25',
};

export default meta;
