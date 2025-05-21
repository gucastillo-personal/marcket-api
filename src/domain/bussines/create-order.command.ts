import {
    Inject,
    Injectable,
    BadRequestException,
    InternalServerErrorException,
    NotImplementedException,
  } from '@nestjs/common';
  import { Order } from '../entities/order.entity';
  import { OrderParams } from '../interfaces/order-params.interface';
  import { OrderRepository } from '../repositories/order.repository';
  import { InstrumentRepository } from '../repositories/instrument.repository';
  import { UserHasBalanceForPurchaseCommand } from './user-has-balance-for-purchase.command';
  import { UserHasBalanceForPurchaseParams } from '../interfaces/user-balance-purchase.interface';
import { MarketDataRepository } from '../repositories/market.repository';
  
  @Injectable()
  export class CreateOrderCommand {
    constructor(
      @Inject('OrderRepository')
      private readonly orderRepo: OrderRepository,
  
      @Inject('InstrumentRepository')
      private readonly instrumentRepo: InstrumentRepository,

      @Inject('MarketDataRepository')
      private readonly marketRepo: MarketDataRepository,
  
      private readonly userHasBalanceForpPurchaseCommand: UserHasBalanceForPurchaseCommand,
    ) {}
  
    async createOrder(orderParams: OrderParams): Promise<Order> {
      const newOrder = await this.buildOrder(orderParams);
  
      if (!(await this.isValidOrder(orderParams))) {
        newOrder.setStatus('REJECTED');
      }
  
      return await this.orderRepo.create(newOrder);
    }
  
    private async buildOrder(orderParams: OrderParams): Promise<Order> {
      const newOrder = new Order();
      newOrder.side = orderParams.side;
      newOrder.size = orderParams.size;
      newOrder.price = orderParams.price;
      newOrder.instrumentid = orderParams.instrumentId;
      newOrder.type = orderParams.type ?? 'MARKET';
      newOrder.status = orderParams.type === 'LIMIT' ? 'NEW' : 'FILLED';
      newOrder.userid = orderParams.userId;
      
      if (newOrder.type === 'MARKET') {
        const marketData = await this.marketRepo.getCurrentValueIntrument(orderParams.instrumentId);
        if (marketData) {
          newOrder.setPrice(marketData.getCurrentPrice());
        } else {
          throw new InternalServerErrorException('Market data not found for the given instrument');
        }
      }
      if (newOrder.side === 'CASH_IN') {
        newOrder.setPrice(1);
      }
      return newOrder;
    }
  
    private async isValidOrder(order: OrderParams): Promise<boolean> {
        if (order.userId <= 0) {
            throw new BadRequestException('User UserId is required');
        }

      const instrumentExists = await this.instrumentRepo.existsById(order.instrumentId);
      if (order.instrumentId <= 0 || !instrumentExists) {
        throw new InternalServerErrorException('Instrument not found');
      }
  
      if (order.type === 'LIMIT' && order.price === undefined) {
        throw new BadRequestException('Price is required for LIMIT orders');
      }
  
      if (order.side === 'BUY') {
        return this.validateOrderBuy(order);
      }
      if (order.side === 'SELL') {
        return this.validateOrderSell(order);
      }

      if (order.side === 'CASH_IN') {
        return true;
      }
  
      throw new BadRequestException('Invalid order side');
    }
  
    private async validateOrderBuy(order: OrderParams): Promise<boolean> {
      const isBuyToPrice = this.isBuyToPrice(order.price);
      const isBuyToSize = this.isBuyToSize(order.size);
  
      if (!isBuyToPrice && !isBuyToSize) {
        throw new BadRequestException('Price or size are required for BUY orders');
      }
  
      const params: UserHasBalanceForPurchaseParams = {
        userId: order.userId,
        price: order.price ?? 0,
        size: order.size ?? 0,
        instrumentId: order.instrumentId,
      };
  
      const hasBalance = await this.userHasBalanceForpPurchaseCommand.userHasBalanceForPurchase(params);
      if (!hasBalance) {
        throw new BadRequestException('User has not enough balance for purchase');
      }
  
      return true;
    }
  
    private validateOrderSell(order: OrderParams): boolean {
      throw new NotImplementedException('SELL order validation not implemented yet');
    }
  
    private isBuyToPrice(price: number | undefined): boolean {
      return !(price === undefined || price <= 0);
    }
  
    private isBuyToSize(size: number | undefined): boolean {
      return !(size === undefined || size <= 0);
    }
  }
  