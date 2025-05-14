import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { MarketData } from './marketdata.entity';

@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn() 
  id?: number;               

  @Column({ length: 10 })
  ticker?: string;

  @Column({ length: 255 })
  name?: string;

  @Column({ length: 10 })
  type?: string;

  // @OneToMany(() => Order, (order) => order.instrument)
  // orders: Order[];

  // @OneToMany(() => MarketData, (md) => md.instrument)
  // marketdata: MarketData[];
}
