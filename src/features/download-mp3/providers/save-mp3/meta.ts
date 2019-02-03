
const MetaSaveMp3 = {
  id: 'savemp3',
  name: 'savemp3.net',
  url: 'https://savemp3.net',
  downloadLink: function() {
    return `${this.url}/frame/button/?quality=320&video=${window.location.href}`;
  },
};

export default MetaSaveMp3;
