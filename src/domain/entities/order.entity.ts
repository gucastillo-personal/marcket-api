import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Instrument } from './instrument.entity';
import { StatusOrder } from '../types';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn() 
  id?: number;

  @Column()
  instrumentid?: number;

  @Column()
  userid?: number;

  @Column({ length: 10 })
  side?: string; 

  @Column('int')
  size?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price?: number;

  @Column({ length: 10 })
  type?: string;

  @Column({ length: 20 })
  status?: string;

  @Column({ type: 'timestamp' })
  datetime?: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userid' }) 
  user?: User;

  @ManyToOne(() => Instrument, (instrument) => instrument.orders)
  @JoinColumn({ name: 'instrumentid' }) 
  instrument?: Instrument;


  setStatus(status: StatusOrder) {
    this.status = status;
  }

  setPrice(price: number) {
    this.price = price;
  }
}
