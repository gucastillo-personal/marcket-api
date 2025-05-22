import { SellOrderValidationStrategy } from '../src/domain/bussines/validation-strategies/sell-order-validation.strategy';
import { OrderParams } from '../src/domain/interfaces/order-params.interface';
import { Order } from '../src/domain/entities/order.entity';
import { GetActualPossessionOfAnInstrumentsCommand } from '../src/domain/bussines/get-actual-possesion.command';
import { OrderRepository } from '../src/domain/repositories/order.repository';
import { Instrument } from '../src/domain/entities/instrument.entity';

describe('SellOrderValidationStrategy', () => {
    let strategy: SellOrderValidationStrategy;
    let mockOrderRepo: jest.Mocked<OrderRepository>;
    let mockPossessionCommand: jest.Mocked<GetActualPossessionOfAnInstrumentsCommand>;
  
    beforeEach(() => {
      mockOrderRepo = {
        findByUserId: jest.fn(),
      } as any;
  
      mockPossessionCommand = {
        getActualPossessionOfAnInstruments: jest.fn(),
      } as any;
  
      strategy = new SellOrderValidationStrategy(mockPossessionCommand, mockOrderRepo);
    });
  
    it('should return true if user has enough possession', async () => {
      const order: OrderParams = {
        instrumentId: 1,
        userId: 1,
        side: 'SELL',
        size: 10,
        type: 'MARKET',
        status: 'FILLED',
      };
  
      mockOrderRepo.findByUserId.mockResolvedValue([{ status: 'FILLED' }] as Order[]);
      mockPossessionCommand.getActualPossessionOfAnInstruments.mockReturnValue({
        1: {
          total: 20,
          instrument: {} as Instrument,
          orders: [] as Order[],
        },
      });
  
      const result = await strategy.validate(order);
      expect(result).toBe(true);
    });
  
    it('should throw if user has no possession for instrument', async () => {
      const order: OrderParams = {
        instrumentId: 2,
        userId: 1,
        side: 'SELL',
        size: 5,
        type: 'MARKET',
        status: 'FILLED',
      };
  
      mockOrderRepo.findByUserId.mockResolvedValue([{ status: 'FILLED' }] as Order[]);
      mockPossessionCommand.getActualPossessionOfAnInstruments.mockReturnValue({});
  
      await expect(strategy.validate(order)).rejects.toThrow('User has not enough possession for sell');
    });
  
    it('should throw if order size exceeds possession', async () => {
      const order: OrderParams = {
        instrumentId: 3,
        userId: 1,
        side: 'SELL',
        size: 15,
        type: 'MARKET',
        status: 'FILLED',
      };
  
      mockOrderRepo.findByUserId.mockResolvedValue([{ status: 'FILLED' }] as Order[]);
      mockPossessionCommand.getActualPossessionOfAnInstruments.mockReturnValue({
        3: {
          total: 10,
          instrument: {} as Instrument,
          orders: [] as Order[],
        },
      });
  
      await expect(strategy.validate(order)).rejects.toThrow('User has not enough possession for sell');
    });
  });
  
