import IMeta from '../../interfaces/meta';
import { IVideoPinData } from './interfaces/video-pin.interface';

const meta: IMeta<IVideoPinData> = {
  id: 'myga-video-pin',
  description: 'Pins video in the viewport while you read its comments',
  title: 'Floating video',
  defaultStatus: true,
  defaultData: {
    size: 0,
  },
  videoPageOnly: true,
  isInHistoryTab: false,
  releaseDate: '2019-02-03',
};

export default meta;
