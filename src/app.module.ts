import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { OrderController } from './infrastructure/controllers/order.controller';
import { GetOrdersByUserUseCase } from './application/use-cases/get-orders-by-user.usecase';
// import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';

import { SummaryCommand } from './domain/bussines/summary.command';
import { GetSummaryByUserUseCase } from './application/use-cases/get-summary-by-user.usecase';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { PortfolioController } from './infrastructure/controllers/porfolio.controller';
import { MarketDataRepositoryImpl } from './infrastructure/repositories/marketdata.repository.impl';
import { OrderRepositoryImpl } from './infrastructure/repositories/order.repository.impl';
import { InstrumentRepositoryImpl } from './infrastructure/repositories/instrument.repository.impl';
import { InstrumentController } from './infrastructure/controllers/instrument.controller';
import { SearchInstrumentsByTextUseCase } from './application/use-cases/search-instruments-by-text.usecase';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), DatabaseModule],
  controllers: [OrderController,PortfolioController, InstrumentController],
  providers: [
    GetOrdersByUserUseCase,
    GetSummaryByUserUseCase,
    SearchInstrumentsByTextUseCase,
    SummaryCommand,
    {
      provide: 'OrderRepository',
      useExisting: OrderRepositoryImpl,
    },
    {
      provide: 'UserRepository',
      useExisting: UserRepositoryImpl
    },
    {
      provide: 'MarketDataRepository',
      useExisting: MarketDataRepositoryImpl,
    },{
      provide: 'InstrumentRepository',
      useExisting: InstrumentRepositoryImpl,
    }
  ],
})
export class AppModule {}