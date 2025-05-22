import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderValidationStrategy } from 'src/domain/interfaces/order-validation-strategy.interface';
import { UserHasBalanceForPurchaseCommand } from '../user-has-balance-for-purchase.command';
import { OrderParams } from 'src/domain/interfaces/order-params.interface';
import { UserHasBalanceForPurchaseParams } from 'src/domain/interfaces/user-balance-purchase.interface';


@Injectable()
export class BuyOrderValidationStrategy implements OrderValidationStrategy {
  constructor(private readonly userHasBalanceForpPurchaseCommand: UserHasBalanceForPurchaseCommand) {}

  async validate(order: OrderParams): Promise<boolean> {
    if (order.type === 'LIMIT') {
      return true; // No validation needed for LIMIT orders
    }
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
  private isBuyToPrice(price: number | undefined): boolean {
    return !(price === undefined || price <= 0);
  }

  private isBuyToSize(size: number | undefined): boolean {
    return !(size === undefined || size <= 0);
  }
}