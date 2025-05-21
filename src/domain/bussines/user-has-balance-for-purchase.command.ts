import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GetBalanceAvailableToUserCommand } from "./get-balance-available-to-user.command";
import { OrderRepository } from "../repositories/order.repository";
import { UserHasBalanceForPurchaseParams } from "../interfaces/user-balance-purchase.interface";
import { MarketDataRepository } from "../repositories/market.repository";



@Injectable()
export class UserHasBalanceForPurchaseCommand {

    constructor(
        private readonly getBalanceAvailableToUserCommand: GetBalanceAvailableToUserCommand,
        @Inject('OrderRepository')
        private readonly orderRepo: OrderRepository,
        @Inject('MarketDataRepository')
        private readonly marketRepo: MarketDataRepository,
    ) {}

    async userHasBalanceForPurchase(params :UserHasBalanceForPurchaseParams): Promise<boolean>{
        const {userId, price, size, instrumentId } = params;

        const ordersByUser = await this.orderRepo.findByUserId(userId);
        const totalAvailableToInvest = this.getBalanceAvailableToUserCommand.getTotalAvailableToInvest(ordersByUser);
        if(price === 0 &&  size === 0){
            throw new BadRequestException('Price or size are required');
        }

        if( price > totalAvailableToInvest){
            throw new BadRequestException('User has not enough balance to purchase');
        }
        
        if(size > 0){
            const marketData = await this.marketRepo.getCurrentValueIntrument(instrumentId);
            if (!marketData) {
                throw new BadRequestException('Market data is unavailable for the given instrument');
            }
            const totalPriceToPurchase = marketData.getCurrentPrice() * size;
            if (totalPriceToPurchase > totalAvailableToInvest) {
                throw new BadRequestException('User has not enough balance to purchase');
            }
        }
        
        return true;
    }    
}