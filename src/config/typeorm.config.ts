import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { Instrument } from '../domain/entities/instrument.entity';
import { Order } from '../domain/entities/order.entity';
import { MarketData } from '../domain/entities/marketdata.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [User, Instrument, Order, MarketData],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
};