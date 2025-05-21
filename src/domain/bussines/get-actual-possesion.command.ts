import { Injectable } from "@nestjs/common";
import { Order } from "../entities/order.entity";
import { Instrument } from "../entities/instrument.entity";

@Injectable()
export class GetActualPossessionOfAnInstrumentsCommand {

    constructor(
        
    ) {}
    getActualPossessionOfAnInstruments(
        orders: Order[]
      ): { [key: string]: { total: number; instrument: Instrument, orders: Order[] } } {
        const ordersGroupedByInstrument = this.groupOrdersByInstrument(orders);
        const actualPossession: { [key: string]: { total: number; instrument: Instrument, orders: Order[]} } = {};
      
        for (const instrumentId in ordersGroupedByInstrument) {
          const orders = ordersGroupedByInstrument[instrumentId];
      
          const totalBuy = orders
            .filter(order => order.side === 'BUY')
            .reduce((acc, order) => acc + (order.size ?? 0), 0);
         
      
          const totalSell = orders
            .filter(order => order.side === 'SELL')
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
      private groupOrdersByInstrument(orders: Order[]) {
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