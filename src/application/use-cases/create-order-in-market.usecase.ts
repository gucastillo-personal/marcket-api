import { Injectable } from '@nestjs/common';
import { CreateOrderCommand } from 'src/domain/bussines/create-order.command';
import { Order } from 'src/domain/entities/order.entity';
import { OrderParams } from 'src/domain/interfaces/order-params.interface';


@Injectable()
export class CreateOrderUseCase {
  constructor(
    
    private readonly createOrderCommand:CreateOrderCommand,
  ) {}

  async execute(params: OrderParams): Promise<Order> {
    return this.createOrderCommand.createOrder(params);
  }
}
