export class Asset{
    constructor(
        instrumentId: string,
        name: string,
        size: number,
        oldPrice: number,
        currentPrice: number,
      ) {
        this.instrumentId = instrumentId;
        this.name = name;
        this.size = size;
        this.value = currentPrice * size;
        this.oldPrice = oldPrice;
        this.performance = ((currentPrice - oldPrice) / oldPrice) * 100;
      }
    instrumentId: string;
    name: string;
    size: number;
    value: number;
    performance: number;
    oldPrice: number;
}