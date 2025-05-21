import { Asset } from "src/domain/entities/asset.entity";
import { AssetDTO } from "./asset.dto";
import AssetBeToDTOMapper from '../mappers/asset-be-to-dto.mapper';

export class PortfolioSummaryDTO {
    constructor(
        userId: string,
        totalAvailableToInvest: number,
      ) {
        this.userId = userId;
        this.totalAvailableToInvest = totalAvailableToInvest;
        this.currentValueAccount = 0;
        this.asseets = [];
      }

    

    userId: string;
    email?: string;
    accountNumber?: string;
    currentValueAccount: number;
    totalAvailableToInvest: number;
    asseets?: AssetDTO[];

    setEmail(email: string) {
        this.email = email;
    }

    setAccountNumber(accountNumber: string) {
        this.accountNumber = accountNumber;
    }

    setAssets(assets: Asset[]) {
      this.asseets = assets.map((asset) => AssetBeToDTOMapper(asset));
    }

    setCurrentValueAccount(currentValueAccount: number) {
        this.currentValueAccount = currentValueAccount + this.totalAvailableToInvest;
    }
}


