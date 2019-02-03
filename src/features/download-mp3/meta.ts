import IMeta from '../../interfaces/meta';

const meta: IMeta = {
  id: 'myga-dl-mp3',
  description: 'Enables you to convert Youtube video to downloadable mp3 files',
  title: 'Convert to mp3',
  videoPageOnly: true,
  defaultData: {
    counter: 0,
    songs: [],
  },
  isInHistoryTab: true,
  actionTitle: 'converted',
};

export default meta;
