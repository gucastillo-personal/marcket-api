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
import { GetBalanceAvailableToUserCommand } from './domain/bussines/get-balance-available-to-user.command';
import { UserHasBalanceForPurchaseCommand } from './domain/bussines/user-has-balance-for-purchase.command';
import { CreateOrderCommand } from './domain/bussines/create-order.command';
import { CreateOrderUseCase } from './application/use-cases/create-order-in-market.usecase';
import { GetActualPossessionOfAnInstrumentsCommand } from './domain/bussines/get-actual-possesion.command';
import { OrderValidationContext } from './domain/bussines/validation-strategies/order-validation-context';
import { CashOutOrderValidationStrategy } from './domain/bussines/validation-strategies/cash-out-order-validation.strategy';
import { CashInOrderValidationStrategy } from './domain/bussines/validation-strategies/cash-in-order-validation.strategy';
import { SellOrderValidationStrategy } from './domain/bussines/validation-strategies/sell-order-validation.strategy';
import { BuyOrderValidationStrategy } from './domain/bussines/validation-strategies/buy-order-validation.strategy';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), DatabaseModule],
  controllers: [OrderController, PortfolioController, InstrumentController],
  providers: [
    GetOrdersByUserUseCase,
    GetSummaryByUserUseCase,
    SearchInstrumentsByTextUseCase,
    CreateOrderUseCase,

    // Lógica de negocio
    GetActualPossessionOfAnInstrumentsCommand,
    GetBalanceAvailableToUserCommand,
    UserHasBalanceForPurchaseCommand,
    SummaryCommand,
    CreateOrderCommand,
    // Strategias de validación
    BuyOrderValidationStrategy,
    SellOrderValidationStrategy,
    CashInOrderValidationStrategy,
    CashOutOrderValidationStrategy,
    OrderValidationContext,

    // Repositorios como tokens
    {
      provide: 'OrderRepository',
      useExisting: OrderRepositoryImpl,
    },
    {
      provide: 'UserRepository',
      useExisting: UserRepositoryImpl,
    },
    {
      provide: 'MarketDataRepository',
      useExisting: MarketDataRepositoryImpl,
    },
    {
      provide: 'InstrumentRepository',
      useExisting: InstrumentRepositoryImpl,
    },
  ],
})
export class AppModule {}
