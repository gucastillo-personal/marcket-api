import { Controller, Get, Post, Body, Param, InternalServerErrorException } from '@nestjs/common';
import { GetOrdersByUserUseCase } from '../../application/use-cases/get-orders-by-user.usecase';
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order-in-market.usecase';
import { OrderParams } from 'src/domain/interfaces/order-params.interface';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly getOrdersByUser: GetOrdersByUserUseCase,
    private readonly createOrder: CreateOrderUseCase,
  ) {}

  @Get('user/:userId')
  async getOrders(@Param('userId') userId: string): Promise<Order[]> {
    return this.getOrdersByUser.execute(userId);
  }

  @Post('create')
  async create(@Body() orderData: OrderParams): Promise<Order> {
    try {
      return await this.createOrder.execute(orderData);
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error; // Nest devolverá la HttpException automáticamente
    }
}

}
