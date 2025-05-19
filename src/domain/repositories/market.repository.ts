import { MarketData } from '../entities/marketdata.entity';

export interface MarketDataRepository {
   getCurrentValueIntrument(idInstrument: number): Promise<MarketData | null>;
}