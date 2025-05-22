import { CashInOrderValidationStrategy } from '../src/domain/bussines/validation-strategies/cash-in-order-validation.strategy';
import { BadRequestException } from '@nestjs/common';
import { OrderParams } from '../src/domain/interfaces/order-params.interface';
import { InstrumentRepository } from '../src/domain/repositories/instrument.repository';

describe('CashInOrderValidationStrategy', () => {
  let strategy: CashInOrderValidationStrategy;
  let mockInstrumentRepo: jest.Mocked<InstrumentRepository>;

  beforeEach(() => {
    mockInstrumentRepo = {
      instrumentIsMoney: jest.fn(),
    } as any;

    strategy = new CashInOrderValidationStrategy(mockInstrumentRepo);
  });

  it('should return true if instrument is a currency', async () => {
    mockInstrumentRepo.instrumentIsMoney.mockResolvedValue(true);

    const order: OrderParams = {
        instrumentId: 1,
        side: 'CASH_IN',
        userId: 1,
        type: 'MARKET',
        size: 0,
        status: 'NEW'
    };

    const result = await strategy.validate(order);
    expect(result).toBe(true);
    expect(mockInstrumentRepo.instrumentIsMoney).toHaveBeenCalledWith(1);
  });

  it('should throw if instrument is not a currency', async () => {
    mockInstrumentRepo.instrumentIsMoney.mockResolvedValue(false);

    const order: OrderParams = {
        instrumentId: 99,
        side: 'CASH_IN',
        userId: 1,
        type: 'MARKET',
        size: 0,
        status: 'NEW'
    };

    await expect(strategy.validate(order)).rejects.toThrow(BadRequestException);
    expect(mockInstrumentRepo.instrumentIsMoney).toHaveBeenCalledWith(99);
  });
});
