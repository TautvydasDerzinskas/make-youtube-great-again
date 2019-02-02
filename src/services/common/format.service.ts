class FormatService {
  private numberScales = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'k' },
    { value: 1E6, symbol: 'M' },
    { value: 1E9, symbol: 'G' },
    { value: 1E12, symbol: 'T' },
    { value: 1E15, symbol: 'P' },
    { value: 1E18, symbol: 'E' },
  ];

  public formatNumber(numberValue: number) {
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = this.numberScales.length - 1; i > 0; i--) {
      if (numberValue >= this.numberScales[i].value) {
        break;
      }
    }
    return (numberValue / this.numberScales[i].value)
      .toFixed(0).replace(rx, '$1') + this.numberScales[i].symbol;
  }
}

export default new FormatService();
