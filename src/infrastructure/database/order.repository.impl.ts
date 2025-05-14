import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async findByUserId(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userid: userId },
      // relations: ['instrument'],
      order: { datetime: 'DESC' },
    });
  }

  async create(order: Partial<Order>): Promise<Order> {
    const newOrder = this.orderRepo.create(order);
    return this.orderRepo.save(newOrder);
  }
}
