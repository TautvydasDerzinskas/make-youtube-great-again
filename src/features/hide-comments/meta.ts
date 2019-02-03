import IMeta from '../../interfaces/meta';

const meta: IMeta = {
  id: 'myga-hide-comments',
  description: 'Hides regular comments & live chat messages',
  title: 'Hide comments',
  defaultStatus: false,
  defaultData: {
    chat: true,
    comments: true,
  },
  videoPageOnly: true,
  isInHistoryTab: false,
  hasSettings: true,
};

export default meta;
