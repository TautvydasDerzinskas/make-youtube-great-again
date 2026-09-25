import IMeta from '../../interfaces/meta';

const meta: IMeta<{}> = {
  id: 'myga-audio-mode',
  description: 'Adds an "Audio" button under videos. Marked videos always play as audio: lowest video quality behind the video artwork, same sound quality',
  title: 'Audio mode',
  defaultStatus: true,
  videoPageOnly: true,
  isInHistoryTab: false,
  releaseDate: '2026-09-25',
};

export default meta;
