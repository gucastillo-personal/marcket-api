import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetActualPossessionOfAnInstrumentsCommand } from '../get-actual-possesion.command';
import { OrderRepository } from 'src/domain/repositories/order.repository';
import { OrderValidationStrategy } from 'src/domain/interfaces/order-validation-strategy.interface';
import { OrderParams } from 'src/domain/interfaces/order-params.interface';

@Injectable()
export class SellOrderValidationStrategy implements OrderValidationStrategy {
    constructor(
        private readonly getPossessionCommand: GetActualPossessionOfAnInstrumentsCommand,
        @Inject('OrderRepository')
        private readonly orderRepo: OrderRepository,
    ) {}
  async validate(order: OrderParams): Promise<boolean> {
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
}