import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepositoryImpl } from '../repositories/user.repository.impl';
import { OrderRepositoryImpl } from '../repositories/order.repository.impl';
import { MarketDataRepositoryImpl } from '../repositories/marketdata.repository.impl';

import { User } from '../../domain/entities/user.entity';
import { Order } from '../../domain/entities/order.entity';
import { Instrument } from '../../domain/entities/instrument.entity';
import { MarketData } from '../../domain/entities/marketdata.entity';
import { InstrumentRepositoryImpl } from '../repositories/instrument.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Instrument, MarketData])],
  providers: [UserRepositoryImpl,OrderRepositoryImpl,MarketDataRepositoryImpl, InstrumentRepositoryImpl],
  exports: [UserRepositoryImpl,OrderRepositoryImpl, MarketDataRepositoryImpl, InstrumentRepositoryImpl],
})
export class DatabaseModule {}
