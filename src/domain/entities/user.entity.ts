import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() 
  id?: number;

  @Column({ length: 255 })
  email?: string;

  @Column({ name: 'accountnumber', length: 20 }) 
  accountNumber?: string;

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];
}
