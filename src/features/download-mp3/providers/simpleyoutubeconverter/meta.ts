
const MetaSaveMp3 = {
  id: 'simpleyoutubeconverter',
  name: 'simpleyoutubeconverter.com',
  url: 'http://simpleyoutubeconverter.com',
  downloadLink: function () {
    return `${this.url}/popup-loader.html#${window.location.href}`;
  },
};

export default MetaSaveMp3;
