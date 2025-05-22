import {
    Inject,
    Injectable,
    BadRequestException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { Order } from '../entities/order.entity';
  import { OrderParams } from '../interfaces/order-params.interface';
  import { OrderRepository } from '../repositories/order.repository';
  import { InstrumentRepository } from '../repositories/instrument.repository';
import { MarketDataRepository } from '../repositories/market.repository';
import { OrderValidationContext } from './validation-strategies/order-validation-context';
import { BuyOrderValidationStrategy } from './validation-strategies/buy-order-validation.strategy';
import { SellOrderValidationStrategy } from './validation-strategies/sell-order-validation.strategy';
import { CashInOrderValidationStrategy } from './validation-strategies/cash-in-order-validation.strategy';
  
  @Injectable()
  export class CreateOrderCommand {
    constructor(
      @Inject('OrderRepository')
      private readonly orderRepo: OrderRepository,
  
      @Inject('InstrumentRepository')
      private readonly instrumentRepo: InstrumentRepository,

      @Inject('MarketDataRepository')
      private readonly marketRepo: MarketDataRepository,

      private readonly validationContext: OrderValidationContext,
      private readonly buyStrategy: BuyOrderValidationStrategy,
      private readonly sellStrategy: SellOrderValidationStrategy,
      private readonly cashInStrategy: CashInOrderValidationStrategy,
      private readonly cashOutStrategy: CashInOrderValidationStrategy,
    ) {

      this.validationContext.register('BUY', this.buyStrategy);
      this.validationContext.register('SELL', this.sellStrategy);
      this.validationContext.register('CASH_IN', this.cashInStrategy);
      this.validationContext.register('CASH_OUT', this.cashOutStrategy);
    }
  
    async createOrder(orderParams: OrderParams): Promise<Order> {
      const newOrder = await this.buildOrder(orderParams);
  
      if (!(await this.isValidOrder(orderParams))) {
        newOrder.setStatus('REJECTED');
      }
  
      return await this.orderRepo.create(newOrder);
    }
  
    // Se podria hacer un builder para el order
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

      if (newOrder.side === 'CASH_IN' || newOrder.side === 'CASH_OUT') {
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

      return await this.validationContext.validate(order);

    }
  }
  