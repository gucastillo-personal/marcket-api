import { Inject, Injectable } from "@nestjs/common";
import { Order } from "../entities/order.entity";
import { MarketDataRepository } from "../repositories/market.repository";
import { Asset } from "../entities/asset.entity";
import { Instrument } from "../entities/instrument.entity";
import { MarketData } from "../entities/marketdata.entity";

@Injectable()
export class SummaryCommand {

    constructor(
        @Inject('MarketDataRepository')
        private readonly marcketRepo: MarketDataRepository,
    ) {}

    getTotalAvailableToInvest(orders :Order[]): number{
        const ordersFilled = orders.filter(order => order.status === 'FILLED');
       
        const cashInList = ordersFilled.filter(order => order.side === 'CASH_IN');
        const cashOutList = ordersFilled.filter(order => order.side === 'CASH_OUT');
        const buyList = ordersFilled.filter(order => order.side === 'BUY');
        const sellList = ordersFilled.filter(order => order.side === 'SELL');

        const totalValueCashIn = cashInList.reduce((acc, order) => acc + ((order.price ?? 0) * (order.size ?? 0)), 0);
        const totalValueCashOut = cashOutList.reduce((acc, order) => acc + ((order.price ?? 0) * (order.size ?? 0)), 0);
        const totalValueBuy = buyList.reduce((acc, order) => acc + ((order.price ?? 0) * (order.size ?? 0)), 0);
        const totalValueSell = sellList.reduce((acc, order) => acc + ((order.price ?? 0) * (order.size ?? 0)), 0);
        
        
        return  (totalValueCashIn + totalValueSell ) - (totalValueCashOut + totalValueBuy);
    }

    async getCurrentValueAccount(orders: Order[]): Promise<number> {
        const ordersFilled = orders.filter(order => order.status === 'FILLED');
        let totalValueAccount = 0;

        const ordersGroupedByInstrument = this.groupOrdersByInstrument(ordersFilled);
        const actualPossessionOfAnInstruments = this.getActualPossessionOfAnInstruments(ordersGroupedByInstrument)
        
        for (const instrumentId in actualPossessionOfAnInstruments) {
            const possession = actualPossessionOfAnInstruments[instrumentId];
            if (possession.total > 0) {
                const marketData = await this.getCurrentValueInstrument(Number(instrumentId));
                totalValueAccount += possession.total * (marketData?.close ?? 0);
            }
        }
        return totalValueAccount;
    }
    async getCurrentValueInstrument(instrumentId: number): Promise<MarketData | null> {
        // Hacer una cache en memoria para no hacer tantas consultas a la base de datos
        const marketData = await this.marcketRepo.getCurrentValueIntrument(instrumentId);
        return marketData;
    }

    async getAssets(orders: Order[]): Promise<Asset[]> {
        const ordersFilled = orders.filter(order => order.status === 'FILLED');
        const ordersGroupedByInstrument = this.groupOrdersByInstrument(ordersFilled);
        const actualPossessionOfAnInstruments = this.getActualPossessionOfAnInstruments(ordersGroupedByInstrument)
        const assets: Asset[] = [];
        for (const instrumentId in actualPossessionOfAnInstruments) {
            const possession = actualPossessionOfAnInstruments[instrumentId];
            if (possession.total > 0) {
                
                const currentMarketData = await this.getCurrentValueInstrument(Number(instrumentId));
                const { instrument , total } = possession;
                const currentPrice = currentMarketData?.close ?? 0;
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
    getActualPossessionOfAnInstruments(
        ordersGroupedByInstrument: { [key: string]: Order[] }
      ): { [key: string]: { total: number; instrument: Instrument, orders: Order[] } } {
        const actualPossession: { [key: string]: { total: number; instrument: Instrument, orders: Order[]} } = {};
      
        for (const instrumentId in ordersGroupedByInstrument) {
          const orders = ordersGroupedByInstrument[instrumentId];
      
          const totalBuy = orders
            .filter(order => order.side === 'BUY' || order.side === 'CASH_IN')
            .reduce((acc, order) => acc + (order.size ?? 0), 0);
      
          const totalSell = orders
            .filter(order => order.side === 'SELL' || order.side === 'CASH_OUT')
            .reduce((acc, order) => acc + (order.size ?? 0), 0);
      
          const instrument = orders[0]?.instrument as Instrument;
      
          actualPossession[instrumentId] = {
            total: totalBuy - totalSell,
            instrument,
            orders,
          };
        }
      
        return actualPossession;
      }

    groupOrdersByInstrument(orders: Order[]) {
        const ordersGroupedByInstrument: { [key: string]: Order[] } = {};

        for (const order of orders) {
            const instrumentId = order.instrumentid;
            if (instrumentId) {
                if (!ordersGroupedByInstrument[instrumentId]) {
                    ordersGroupedByInstrument[instrumentId] = [];
                }
                ordersGroupedByInstrument[instrumentId].push(order);
            }
        }

        return ordersGroupedByInstrument;
    }
}