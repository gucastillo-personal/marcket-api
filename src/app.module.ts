import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { OrderController } from './infrastructure/controllers/order.controller';
import { GetOrdersByUserUseCase } from './application/use-cases/get-orders-by-user.usecase';
// import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';

import { SummaryCommand } from './domain/bussines/summary.command';
import { GetSummaryByUserUseCase } from './application/use-cases/get-summary-by-user.usecase';
import { UserRepositoryImpl } from './infrastructure/database/user.repository.impl';
import { PortfolioController } from './infrastructure/controllers/porfolio.controller';
import { MarketDataRepositoryImpl } from './infrastructure/database/marketdata.repository.impl';
import { OrderRepositoryImpl } from './infrastructure/database/order.repository.impl';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), DatabaseModule],
  controllers: [OrderController,PortfolioController],
  providers: [
    GetOrdersByUserUseCase,
    GetSummaryByUserUseCase,
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
    }
  ],
})
export class AppModule {}