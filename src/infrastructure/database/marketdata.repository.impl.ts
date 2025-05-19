import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketData } from '../../domain/entities/marketdata.entity';
import { MarketDataRepository } from '../../domain/repositories/market.repository';

@Injectable()
export class MarketDataRepositoryImpl implements MarketDataRepository {
  constructor(
    @InjectRepository(MarketData)
    private readonly marketRepo: Repository<MarketData>,
  ) {}

  async getCurrentValueIntrument(instrumentId: number): Promise<MarketData | null> {
    try {
      return this.marketRepo.createQueryBuilder('m')
      .where('m.instrumentId = :instrumentId', { instrumentId })
      .orderBy('m.date', 'DESC')
      .limit(1)
      .getOne();
    } catch (error) {
      console.error('Error fetching current value for instrument:', error);
      return null;
      
    }
   
  }
  
}
