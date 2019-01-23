const MetaFlvo = {
  name: 'flvto.biz',
  url: 'https://www.flvto.biz',
  downloadLink: function(videoId: string) {
    return `${this.url}#${videoId}`;
  },
};

export default MetaFlvo;
