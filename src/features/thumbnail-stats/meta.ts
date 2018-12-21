import IMeta from '../../interfaces/meta';

const meta: IMeta = {
  id: 'myga-thumb-preview',
  description: 'Displays like stats within thumbnails when hovering with mouse',
  title: 'Thumbnail stats',
  defaultData: {
    counter: 0,
    songs: [],
  },
  isInHistoryTab: true,
  actionTitle: 'got thumbnail indicator'
};

export default meta;
