export interface OrderParams {
    instrumentId: number;
    type: 'LIMIT' | 'MARKET';
    side: 'BUY' | 'SELL' | 'CASH_IN' | 'CASH_OUT';
    size: number;
    price?: number;
    status: 'NEW' | 'FILLED' | 'REJECTED' | 'CANCELED';
    date?: Date;
    userId: number;
}