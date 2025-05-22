import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrderParams } from 'src/domain/interfaces/order-params.interface';
import { OrderValidationStrategy } from 'src/domain/interfaces/order-validation-strategy.interface';

@Injectable()
export class OrderValidationContext {
  private strategies = new Map<string, OrderValidationStrategy>();

  register(type: string, strategy: OrderValidationStrategy) {
    this.strategies.set(type, strategy);
  }

  async validate(order: OrderParams): Promise<boolean> {
    const strategy = this.strategies.get(order.side);
    if (!strategy) {
      throw new InternalServerErrorException(`No validation strategy found for side: ${order.side}`);
    }
    return strategy.validate(order);
  }
}