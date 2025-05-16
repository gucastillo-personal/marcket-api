import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepositoryImpl } from './user.repository.impl';
import { OrderRepositoryImpl } from './order.repository.impl';
import { User } from '../../domain/entities/user.entity';
import { Order } from '../../domain/entities/order.entity';
import { Instrument } from '../../domain/entities/instrument.entity';
import { MarketData } from '../../domain/entities/marketdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Instrument, MarketData])],
  providers: [UserRepositoryImpl,OrderRepositoryImpl],
  exports: [UserRepositoryImpl,OrderRepositoryImpl],
})
export class DatabaseModule {}
