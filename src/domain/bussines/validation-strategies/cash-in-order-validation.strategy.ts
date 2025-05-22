import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrderParams } from 'src/domain/interfaces/order-params.interface';
import { OrderValidationStrategy } from 'src/domain/interfaces/order-validation-strategy.interface';
import { InstrumentRepository } from 'src/domain/repositories/instrument.repository';

@Injectable()
export class CashInOrderValidationStrategy implements OrderValidationStrategy {
    constructor(
        @Inject('InstrumentRepository')
        private readonly instrumentRepo: InstrumentRepository,
    ) {}
  async validate(order: OrderParams): Promise<boolean> {
    const isMoney = await this.instrumentRepo.instrumentIsMoney(order.instrumentId);
      if (!isMoney) {
        throw new BadRequestException('Instrument is not a currency');
      }
      return true;
  }
}