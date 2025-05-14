import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() // INTEGER autoincremental
  id?: number;

  @Column({ length: 255 })
  email?: string;

  @Column({ name: 'accountnumber', length: 20 }) // usa el nombre real en la DB
  accountNumber?: string;

  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];
}
