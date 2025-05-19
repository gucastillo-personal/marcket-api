export class AssetDTO {
    constructor(
        name: string,
        value: number,
        performance: number,
        size: number,
      ) {
        this.name = name;
        this.value = value;
        this.performance = performance;
        this.size = size;
      }
    name: string;
    size: number;
    value: number;
    performance: number;

}