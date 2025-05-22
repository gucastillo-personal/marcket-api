import { BuyOrderValidationStrategy } from '../src/domain/bussines/validation-strategies/buy-order-validation.strategy';
import { BadRequestException } from '@nestjs/common';
import { OrderParams } from '../src/domain/interfaces/order-params.interface';
import { UserHasBalanceForPurchaseCommand } from '../src/domain/bussines/user-has-balance-for-purchase.command';

describe('BuyOrderValidationStrategy', () => {
  let strategy: BuyOrderValidationStrategy;
  let mockUserHasBalance: jest.Mocked<UserHasBalanceForPurchaseCommand>;

  beforeEach(() => {
    mockUserHasBalance = {
      userHasBalanceForPurchase: jest.fn(),
    } as any;

    strategy = new BuyOrderValidationStrategy(mockUserHasBalance);
  });

  it('should skip validation for LIMIT orders', async () => {
    const order: OrderParams = {
        type: 'LIMIT',
        side: 'BUY',
        userId: 1,
        price: 10,
        size: 5,
        instrumentId: 1,
        status: 'NEW'
    };

    const result = await strategy.validate(order);
    expect(result).toBe(true);
    expect(mockUserHasBalance.userHasBalanceForPurchase).not.toHaveBeenCalled();
  });

  it('should throw if price and size are invalid', async () => {
    const order: OrderParams = {
        type: 'MARKET',
        side: 'BUY',
        userId: 1,
        instrumentId: 1,
        size: 0,
        status: 'NEW'
    };

    await expect(strategy.validate(order)).rejects.toThrow(BadRequestException);
    expect(mockUserHasBalance.userHasBalanceForPurchase).not.toHaveBeenCalled();
  });

  it('should throw if user has no balance', async () => {
    mockUserHasBalance.userHasBalanceForPurchase.mockResolvedValue(false);

    const order: OrderParams = {
        type: 'MARKET',
        side: 'BUY',
        userId: 1,
        price: 10,
        size: 5,
        instrumentId: 1,
        status: 'NEW'
    };

    await expect(strategy.validate(order)).rejects.toThrow('User has not enough balance for purchase');
    expect(mockUserHasBalance.userHasBalanceForPurchase).toHaveBeenCalled();
  });

  it('should return true if order is valid and user has balance', async () => {
    mockUserHasBalance.userHasBalanceForPurchase.mockResolvedValue(true);

    const order: OrderParams = {
        type: 'MARKET',
        side: 'BUY',
        userId: 1,
        price: 10,
        size: 2,
        instrumentId: 1,
        status: 'NEW'
    };

    const result = await strategy.validate(order);
    expect(result).toBe(true);
    expect(mockUserHasBalance.userHasBalanceForPurchase).toHaveBeenCalled();
  });
});
