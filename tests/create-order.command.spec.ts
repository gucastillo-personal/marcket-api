import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderCommand } from '../src/domain/bussines/create-order.command';
import { OrderRepository } from '../src/domain/repositories/order.repository';
import { InstrumentRepository } from '../src/domain/repositories/instrument.repository';
import { MarketDataRepository } from '../src/domain/repositories/market.repository';
import { OrderValidationContext } from '../src/domain/bussines/validation-strategies/order-validation-context';
import { BuyOrderValidationStrategy } from '../src/domain/bussines/validation-strategies/buy-order-validation.strategy';
import { SellOrderValidationStrategy } from '../src/domain/bussines/validation-strategies/sell-order-validation.strategy';
import { CashInOrderValidationStrategy } from '../src/domain/bussines/validation-strategies/cash-in-order-validation.strategy';
import { OrderParams } from '../src/domain/interfaces/order-params.interface';
import { Order } from '../src/domain/entities/order.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { StatusOrder } from '../src/domain/types';

describe('CreateOrderCommand', () => {
  let createOrderCommand: CreateOrderCommand;
  let orderRepo: jest.Mocked<OrderRepository>;
  let instrumentRepo: jest.Mocked<InstrumentRepository>;
  let marketRepo: jest.Mocked<MarketDataRepository>;
  let validationContext: jest.Mocked<OrderValidationContext>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderCommand,
        {
          provide: 'OrderRepository',
          useValue: { create: jest.fn() },
        },
        {
          provide: 'InstrumentRepository',
          useValue: { existsById: jest.fn() },
        },
        {
          provide: 'MarketDataRepository',
          useValue: { getCurrentValueIntrument: jest.fn() },
        },
        {
          provide: OrderValidationContext,
          useValue: { register: jest.fn(), validate: jest.fn() },
        },
        { provide: BuyOrderValidationStrategy, useValue: {} },
        { provide: SellOrderValidationStrategy, useValue: {} },
        { provide: CashInOrderValidationStrategy, useValue: {} },
      ],
    }).compile();

    createOrderCommand = module.get(CreateOrderCommand);
    orderRepo = module.get('OrderRepository');
    instrumentRepo = module.get('InstrumentRepository');
    marketRepo = module.get('MarketDataRepository');
    validationContext = module.get(OrderValidationContext);
  });

  it('should throw if instrument does not exist', async () => {
    instrumentRepo.existsById.mockResolvedValue(false);
    marketRepo.getCurrentValueIntrument.mockResolvedValue({
        getCurrentPrice: () => 100,
      } as any);

    const orderParams: OrderParams = {
        instrumentId: 99,
        side: 'BUY',
        size: 1,
        userId: 1,
        type: 'MARKET',
        status: 'NEW'
    };

    await expect(createOrderCommand.createOrder(orderParams)).rejects.toThrow(
      'Instrument not found',
    );
  });

  it('should create a valid market order', async () => {
    instrumentRepo.existsById.mockResolvedValue(true);
    validationContext.validate.mockResolvedValue(true);

    marketRepo.getCurrentValueIntrument.mockResolvedValue({
      getCurrentPrice: () => 100,
    } as any);

    orderRepo.create.mockImplementation(async (order: Partial<Order>) => {
      return { ...order, setStatus: (status: StatusOrder) => {} } as Order;
    });

    const orderParams: OrderParams = {
        instrumentId: 1,
        side: 'BUY',
        size: 2,
        userId: 5,
        type: 'MARKET',
        status: 'NEW'
    };

    const result = await createOrderCommand.createOrder(orderParams);

    expect(result.price).toBe(100);
    expect(result.status).toBe('FILLED');
    expect(orderRepo.create).toHaveBeenCalled();
  });

  it('should throw if market data is missing', async () => {
    instrumentRepo.existsById.mockResolvedValue(true);
    validationContext.validate.mockResolvedValue(true);
    marketRepo.getCurrentValueIntrument.mockResolvedValue(null);

    const orderParams: OrderParams = {
        instrumentId: 1,
        side: 'BUY',
        size: 2,
        userId: 5,
        type: 'MARKET',
        status: 'NEW'
    };

    await expect(createOrderCommand.createOrder(orderParams)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
