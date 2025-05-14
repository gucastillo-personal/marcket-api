import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { OrderController } from './infrastructure/controllers/order.controller';
import { GetOrdersByUserUseCase } from './application/use-cases/get-orders-by-user.usecase';
// import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';
import { OrderRepositoryImpl } from './infrastructure/database/order.repository.impl';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), DatabaseModule],
  controllers: [OrderController],
  providers: [
    GetOrdersByUserUseCase,
    // CreateOrderUseCase,
    {
      provide: 'OrderRepository',
      useExisting: OrderRepositoryImpl,
    },
  ],
})
export class AppModule {}