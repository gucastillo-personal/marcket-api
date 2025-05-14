import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryImpl } from './user.repository.impl';
import { OrderRepositoryImpl } from './order.repository.impl';
import { Order } from 'src/domain/entities/order.entity';
import { Instrument } from 'src/domain/entities/instrument.entity';
import { MarketData } from 'src/domain/entities/marketdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Instrument, MarketData])],
  providers: [UserRepositoryImpl,OrderRepositoryImpl],
  exports: [UserRepositoryImpl,OrderRepositoryImpl],
})
export class DatabaseModule {}
