import IMeta from '../../interfaces/meta';

const meta: IMeta = {
  id: 'myga-looper',
  description: 'Allows you to play YouTube videos on repeat mode',
  title: 'Looper',
  defaultData: {
    counter: 0,
    songs: [],
  },
  videoPageOnly: true,
  isInHistoryTab: true,
  actionTitle: 'looped',
};

export default meta;
