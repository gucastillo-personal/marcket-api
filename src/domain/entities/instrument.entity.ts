import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { MarketData } from './marketdata.entity';

@Entity('instruments')
export class Instrument {
  
  constructor(
    id: number,
    ticker: string,
    name: string,
    type: string,
  ) {
    this.id = id;
    this.ticker = ticker;
    this.name = name;
    this.type = type;
  }
  @PrimaryGeneratedColumn() 
  id: number | undefined;               

  @Column({ length: 10 })
  ticker?: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 10 })
  type?: string;

  @OneToMany(() => Order, (order) => order.instrument)
  orders?: Order[];

  // @OneToMany(() => MarketData, (md) => md.instrument)
  // marketdata: MarketData[];
}
