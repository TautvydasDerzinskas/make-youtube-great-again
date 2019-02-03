import IMeta from '../../interfaces/meta';
import { IBaseSongsFeatureData } from '../../interfaces/feature';

const meta: IMeta<IBaseSongsFeatureData> = {
  id: 'myga-thumb-preview',
  description: 'Displays like stats within thumbnails when hovering with mouse',
  title: 'Thumbnail stats',
  defaultData: {
    counter: 0,
    songs: [],
  },
  isInHistoryTab: true,
  actionTitle: 'hovered'
};

export default meta;
