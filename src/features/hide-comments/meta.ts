import IMeta from '../../interfaces/meta';
import { IHideCommentsData } from './interfaces/hide-comments.interface';

const meta: IMeta<IHideCommentsData> = {
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
