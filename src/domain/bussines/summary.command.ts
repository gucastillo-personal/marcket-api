import { Inject, Injectable } from "@nestjs/common";
import { Order } from "../entities/order.entity";
import { MarketDataRepository } from "../repositories/market.repository";
import { Asset } from "../entities/asset.entity";
import { MarketData } from "../entities/marketdata.entity";
import { GetBalanceAvailableToUserCommand } from "./get-balance-available-to-user.command";
import { GetActualPossessionOfAnInstrumentsCommand } from "./get-actual-possesion.command";

@Injectable()
export class SummaryCommand {

    constructor(
        @Inject('MarketDataRepository')
        private readonly marketRepo: MarketDataRepository,

        private readonly getBalaceAvailableToUserCommand: GetBalanceAvailableToUserCommand,

        private readonly getPossessionCommand: GetActualPossessionOfAnInstrumentsCommand,
    ) {}

    getTotalAvailableToInvest(orders :Order[]): number{
        return this.getBalaceAvailableToUserCommand.getTotalAvailableToInvest(orders);
    }

    async getCurrentValueAccount(orders: Order[]): Promise<number> {
        const ordersFilled = orders.filter(order => order.status === 'FILLED');
        let totalValueAccount = 0;

        const actualPossessionOfAnInstruments = this.getPossessionCommand.getActualPossessionOfAnInstruments(ordersFilled);
        
        for (const instrumentId in actualPossessionOfAnInstruments) {
            const possession = actualPossessionOfAnInstruments[instrumentId];
            if (possession.total > 0) {
                const marketData = await this.getCurrentValueInstrument(Number(instrumentId));
                const closePrice = marketData?.getCurrentPrice() ?? 1;
                totalValueAccount += possession.total * closePrice;
            }
        }
        return totalValueAccount;
    }
    async getCurrentValueInstrument(instrumentId: number): Promise<MarketData | null> {
        // Hacer una cache en memoria para no hacer tantas consultas a la base de datos
        const marketData = await this.marketRepo.getCurrentValueIntrument(instrumentId);
        return marketData;
    }

    async getAssets(orders: Order[]): Promise<Asset[]> {
        const ordersFilled = orders.filter(order => order.status === 'FILLED');
        const actualPossessionOfAnInstruments = this.getPossessionCommand.getActualPossessionOfAnInstruments(ordersFilled);
        const assets: Asset[] = [];
        for (const instrumentId in actualPossessionOfAnInstruments) {
            const possession = actualPossessionOfAnInstruments[instrumentId];
            if (possession.total > 0) {
                
                const currentMarketData = await this.getCurrentValueInstrument(Number(instrumentId));
                const { instrument , total } = possession;
                const currentPrice = currentMarketData?.getCurrentPrice() ?? 1;
                const orders = possession.orders;
                // Deberia ignorar las ordenes de tipo CASH_IN y CASH_OUT???
                const oldPrice = orders.filter(order => order.side === 'BUY' || order.side === 'CASH_IN').at(-1)?.price ?? 0;
                
                
                const { id, name, } = instrument;
                const asset = new Asset(String(id), name, total, oldPrice, currentPrice);
                assets.push(asset);
            }
        }

        return assets;

    }
    
}