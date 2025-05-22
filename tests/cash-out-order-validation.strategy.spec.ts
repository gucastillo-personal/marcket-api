import { CashOutOrderValidationStrategy } from '../src/domain/bussines/validation-strategies/cash-out-order-validation.strategy';
import { OrderParams } from '../src/domain/interfaces/order-params.interface';
import { InstrumentRepository } from '../src/domain/repositories/instrument.repository';
import { OrderRepository } from '../src/domain/repositories/order.repository';
import { GetBalanceAvailableToUserCommand } from '../src/domain/bussines/get-balance-available-to-user.command';
import { Order } from '../src/domain/entities/order.entity';

describe('CashOutOrderValidationStrategy', () => {
  let strategy: CashOutOrderValidationStrategy;
  let mockInstrumentRepo: jest.Mocked<InstrumentRepository>;
  let mockOrderRepo: jest.Mocked<OrderRepository>;
  let mockBalanceCommand: jest.Mocked<GetBalanceAvailableToUserCommand>;

  beforeEach(() => {
    mockInstrumentRepo = {
      instrumentIsMoney: jest.fn(),
    } as any;

    mockOrderRepo = {
      findByUserId: jest.fn(),
    } as any;

    mockBalanceCommand = {
      getTotalAvailableToInvest: jest.fn(),
    } as any;

    strategy = new CashOutOrderValidationStrategy(
      mockInstrumentRepo,
      mockOrderRepo,
      mockBalanceCommand,
    );
  });

  it('should return true if instrument is currency and user has enough balance', async () => {
    mockInstrumentRepo.instrumentIsMoney.mockResolvedValue(true);
    mockOrderRepo.findByUserId.mockResolvedValue([{ status: 'FILLED' }] as Order[]);
    mockBalanceCommand.getTotalAvailableToInvest.mockReturnValue(100);

    const order: OrderParams = {
        instrumentId: 1,
        userId: 10,
        size: 50,
        side: 'CASH_OUT',
        type: 'MARKET',
        status: 'FILLED'
    };

    const result = await strategy.validate(order);
    expect(result).toBe(true);
  });

  it('should throw if instrument is not a currency', async () => {
    mockInstrumentRepo.instrumentIsMoney.mockResolvedValue(false);

    const order: OrderParams = {
        instrumentId: 2,
        userId: 20,
        size: 10,
        side: 'CASH_OUT',
        type: 'MARKET',
        status: 'FILLED'
    };

    await expect(strategy.validate(order)).rejects.toThrow('Instrument is not a currency');
  });

  it('should throw if user has not enough balance', async () => {
    mockInstrumentRepo.instrumentIsMoney.mockResolvedValue(true);
    mockOrderRepo.findByUserId.mockResolvedValue([{ status: 'FILLED' }] as Order[]);
    mockBalanceCommand.getTotalAvailableToInvest.mockReturnValue(0);

    const order: OrderParams = {
        instrumentId: 3,
        userId: 30,
        size: 20,
        side: 'CASH_OUT',
        type: 'MARKET',
        status: 'FILLED'
    };

    await expect(strategy.validate(order)).rejects.toThrow('User has not enough balance to cash out');
  });
});
