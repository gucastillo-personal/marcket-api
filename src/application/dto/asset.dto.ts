export class AssetDTO {
    constructor(
        name: string,
        value: number,
        performance: number,
      ) {
        this.name = name;
        this.value = value;
        this.performance = performance;
      }
    name: string;
    value: number;
    performance: number;

}