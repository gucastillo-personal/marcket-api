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
import { GetActualPossessionOfAnInstrumentsCommand } from './get-actual-possesion.command';
import { GetBalanceAvailableToUserCommand } from './get-balance-available-to-user.command';
  
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

      private readonly getPossessionCommand: GetActualPossessionOfAnInstrumentsCommand,

      private readonly getBalaceAvailableToUserCommand: GetBalanceAvailableToUserCommand,
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
      newOrder.price = orderParams.price ?? 1;
      newOrder.instrumentid = orderParams.instrumentId;
      newOrder.type = orderParams.type ?? 'MARKET';
      newOrder.status = orderParams.type === 'LIMIT' ? 'NEW' : 'FILLED';
      newOrder.userid = orderParams.userId;
      
      if (newOrder.type === 'MARKET' && newOrder.side !== 'CASH_IN' && newOrder.side !== 'CASH_OUT') {
        const marketData = await this.marketRepo.getCurrentValueIntrument(orderParams.instrumentId);
        if (marketData) {
          newOrder.setPrice(marketData.getCurrentPrice());
        } else {
          throw new InternalServerErrorException('Market data not found for the given instrument');
        }
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
  
      if (order.side === 'BUY' && order.type === "MARKET") {
        return this.validateOrderBuy(order);
      }
      if (order.side === 'SELL' && order.type === "MARKET") {
        return this.validateOrderSell(order);
      }

      if (order.side === 'CASH_IN') {
        return this.validateOrderCashIn(order);
      }

      if (order.side === 'CASH_OUT') {
        return this.validateOrderCashOut(order);
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
  
    private async validateOrderSell(order: OrderParams): Promise<boolean> {
      const orders = await this.orderRepo.findByUserId(Number(order.userId));
      const ordersFilled = orders.filter(order => order.status === 'FILLED');
      const actualPossessionOfAnInstruments = this.getPossessionCommand.getActualPossessionOfAnInstruments(ordersFilled);
      const possession = actualPossessionOfAnInstruments[order.instrumentId];
      if (!possession) {
        throw new BadRequestException('User has not enough possession for sell');
      }
      if (order.size === undefined || order.size <= 0 || order.size > possession.total) {
        throw new BadRequestException('User has not enough possession for sell');
      }

      return true;
    }

    private async validateOrderCashIn(order: OrderParams): Promise<boolean> {
      const isMoney = await this.instrumentRepo.instrumentIsMoney(order.instrumentId);
      if (!isMoney) {
        throw new BadRequestException('Instrument is not a currency');
      }
      return true;
    }

    private async validateOrderCashOut(order: OrderParams): Promise<boolean> {
      const isMoney = await this.instrumentRepo.instrumentIsMoney(order.instrumentId);
        if (!isMoney) {
          throw new BadRequestException('Instrument is not a currency');
        }
        const orders = await this.orderRepo.findByUserId(Number(order.userId));
        const ordersFilled = orders.filter(order => order.status === 'FILLED');
        const availableToCashOut = this.getBalaceAvailableToUserCommand.getTotalAvailableToInvest(ordersFilled);
        
        if (availableToCashOut <= 0 || availableToCashOut < order.size) {
          throw new BadRequestException('User has not enough balance to cash out');
        }

        return true;
    }
  
    private isBuyToPrice(price: number | undefined): boolean {
      return !(price === undefined || price <= 0);
    }
  
    private isBuyToSize(size: number | undefined): boolean {
      return !(size === undefined || size <= 0);
    }
  }
  