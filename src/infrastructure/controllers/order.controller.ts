import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GetOrdersByUserUseCase } from '../../application/use-cases/get-orders-by-user.usecase';
// import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';
import { Order } from '../../domain/entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly getOrdersByUser: GetOrdersByUserUseCase,
    // private readonly createOrder: CreateOrderUseCase,
  ) {}

  @Get('user/:userId')
  async getOrders(@Param('userId') userId: string): Promise<Order[]> {
    return this.getOrdersByUser.execute(userId);
  }

//   @Post()
//   async create(@Body() orderData: Partial<Order>): Promise<Order> {
//     return this.createOrder.execute(orderData);
//   }
}
