import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Instrument } from './instrument.entity';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn() 
  id?: number;

  @Column({ name: 'instrumentid' })
  instrumentId?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  high?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  low?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  open?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  close?: number;

  @Column('decimal', { name:"previousclose", precision: 10, scale: 2 })
  previousClose?: number;

  @Column({ type: 'date' }) 
  date?: string;

  getCurrentPrice(): number {
    return Number(this.close) ?? 0;
  }
  // @ManyToOne(() => Instrument, (instrument) => instrument.marketdata)
  // @JoinColumn({ name: 'instrumentid' }) 
  // instrument: Instrument;
}
