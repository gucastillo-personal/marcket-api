import { Order } from '../entities/order.entity';
import { OrderParams } from '../interfaces/order-params.interface';

export interface OrderRepository {
  findByUserId(userId: number): Promise<Order[]>;
  create(order: Partial<Order>): Promise<Order>;
}