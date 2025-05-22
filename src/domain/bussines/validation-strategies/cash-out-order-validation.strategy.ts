import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InstrumentRepository } from 'src/domain/repositories/instrument.repository';
import { OrderRepository } from 'src/domain/repositories/order.repository';
import { GetBalanceAvailableToUserCommand } from '../get-balance-available-to-user.command';
import { OrderValidationStrategy } from 'src/domain/interfaces/order-validation-strategy.interface';
import { OrderParams } from 'src/domain/interfaces/order-params.interface';

@Injectable()
export class CashOutOrderValidationStrategy implements OrderValidationStrategy {
    constructor(
        @Inject('InstrumentRepository')
        private readonly instrumentRepo: InstrumentRepository,
        @Inject('OrderRepository')
        private readonly orderRepo: OrderRepository,
        private readonly getBalaceAvailableToUserCommand: GetBalanceAvailableToUserCommand,
    ) {}
  async validate(order: OrderParams): Promise<boolean> {
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
}