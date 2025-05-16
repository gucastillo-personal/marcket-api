import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { OrderController } from './infrastructure/controllers/order.controller';
import { GetOrdersByUserUseCase } from './application/use-cases/get-orders-by-user.usecase';
// import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';
import { OrderRepositoryImpl } from './infrastructure/database/order.repository.impl';
import { SummaryCommand } from './domain/bussines/summary.command';
import { GetSummaryByUserUseCase } from './application/use-cases/get-summary-by-user.usecase';
import { UserRepositoryImpl } from './infrastructure/database/user.repository.impl';
import { PortfolioController } from './infrastructure/controllers/porfolio.controller';

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
  ],
})
export class AppModule {}