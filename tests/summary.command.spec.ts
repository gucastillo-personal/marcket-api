import { Test, TestingModule } from '@nestjs/testing';
import { SummaryCommand } from '../src/domain/bussines/summary.command';
import { GetBalanceAvailableToUserCommand } from '../src/domain/bussines/get-balance-available-to-user.command';
import { GetActualPossessionOfAnInstrumentsCommand } from '../src/domain/bussines/get-actual-possesion.command';
import { MarketDataRepository } from '../src/domain/repositories/market.repository';
import { Order } from '../src/domain/entities/order.entity';
import { MarketData } from '../src/domain/entities/marketdata.entity';
import { Instrument } from '../src/domain/entities/instrument.entity';

describe('SummaryCommand', () => {
  let summary: SummaryCommand;
  let marketRepo: jest.Mocked<MarketDataRepository>;
  let getBalanceCmd: jest.Mocked<GetBalanceAvailableToUserCommand>;
  let getPossessionCmd: jest.Mocked<GetActualPossessionOfAnInstrumentsCommand>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummaryCommand,
        {
          provide: 'MarketDataRepository',
          useValue: { getCurrentValueIntrument: jest.fn() },
        },
        {
          provide: GetBalanceAvailableToUserCommand,
          useValue: { getTotalAvailableToInvest: jest.fn() },
        },
        {
          provide: GetActualPossessionOfAnInstrumentsCommand,
          useValue: { getActualPossessionOfAnInstruments: jest.fn() },
        },
      ],
    }).compile();

    summary = module.get(SummaryCommand);
    marketRepo = module.get('MarketDataRepository');
    getBalanceCmd = module.get(GetBalanceAvailableToUserCommand);
    getPossessionCmd = module.get(GetActualPossessionOfAnInstrumentsCommand);
  });

  it('should return available balance to invest', () => {
    getBalanceCmd.getTotalAvailableToInvest.mockReturnValue(500);

    const orders: Order[] = [{ status: 'FILLED' } as Order];
    const result = summary.getTotalAvailableToInvest(orders);
    expect(result).toBe(500);
  });

  it('should return current account value', async () => {
    const mockMarketData: Partial<MarketData> = {
      getCurrentPrice: () => 10,
    };

    const orders: Order[] = [{
      status: 'FILLED',
      instrumentid: 1,
      side: 'BUY',
      size: 2,
      instrument: { id: 1, name: 'AAPL' } as Instrument,
    }] as Order[];

    getPossessionCmd.getActualPossessionOfAnInstruments.mockReturnValue({
      1: {
        total: 2,
        instrument: { id: 1, name: 'AAPL' } as Instrument,
        orders,
      },
    });

    marketRepo.getCurrentValueIntrument.mockResolvedValue(mockMarketData as MarketData);

    const result = await summary.getCurrentValueAccount(orders);
    expect(result).toBe(20); // 2 * 10
  });

  it('should return list of assets', async () => {
    const mockMarketData: Partial<MarketData> = {
      getCurrentPrice: () => 50,
    };

    const orders: Order[] = [{
      status: 'FILLED',
      instrumentid: 1,
      price: 40,
      side: 'BUY',
      size: 1,
      instrument: { id: 1, name: 'MSFT' } as Instrument,
    }] as Order[];

    getPossessionCmd.getActualPossessionOfAnInstruments.mockReturnValue({
      1: {
        total: 1,
        instrument: { id: 1, name: 'MSFT' } as Instrument,
        orders,
      },
    });

    marketRepo.getCurrentValueIntrument.mockResolvedValue(mockMarketData as MarketData);

    const result = await summary.getAssets(orders);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('MSFT');
    expect(result[0].size).toBe(1);
    expect(result[0].value).toBe(50);
    expect(result[0].oldPrice).toBe(40);
  });
});
