import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/domain/repositories/order.repository';

@Injectable()
export class GetOrdersByUserUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepo: OrderRepository,
  ) {}

  async execute(userId: string) {
    return this.orderRepo.findByUserId(Number(userId));
  }
}
