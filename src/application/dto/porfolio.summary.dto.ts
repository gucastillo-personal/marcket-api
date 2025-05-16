import { AssetDTO } from "./asset.dto";

export class PortfolioSummaryDTO {
    constructor(
        userId: string,
        totalAvailableToInvest: number,
      ) {
        this.userId = userId;
        this.totalAvailableToInvest = totalAvailableToInvest;
      }

    // setAssets(assets: AssetDTO[]) {
    //     this.asseets = assets;
    // }

    userId: string;
    totalAvailableToInvest: number;
    // asseets?: AssetDTO[];
}