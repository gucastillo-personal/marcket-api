import { Injectable } from "@nestjs/common";
import { Order } from "../entities/order.entity";

@Injectable()
export class GetBalanceAvailableToUserCommand {

    constructor(
        
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
}