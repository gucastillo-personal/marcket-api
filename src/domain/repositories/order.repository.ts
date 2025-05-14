import { Order } from '../entities/order.entity';

export interface OrderRepository {
  findByUserId(userId: number): Promise<Order[]>;
  create(order: Partial<Order>): Promise<Order>;
}