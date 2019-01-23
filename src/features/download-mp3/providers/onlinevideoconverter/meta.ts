
const MetaOnlineVideoConverter = {
  name: 'onlinevideoconverter.com',
  url: 'https://www.onlinevideoconverter.com',
  downloadLink: function(videoId: string) {
    return `${this.url}/youtube-converter#${videoId}`;
  },
};

export default MetaOnlineVideoConverter;
