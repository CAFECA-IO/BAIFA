export type ICurrencyType = 'CRYPTOCURRENCY' | 'FIAT';

export interface ICurrencyDetail {
  type: ICurrencyType;
  name: string;
  amount: number;
  fairValue: number;
  weightedAverageCost?: number;
}

export const defaultCryptoDetail: ICurrencyDetail = {
  type: 'CRYPTOCURRENCY',
  name: 'None',
  amount: 0,
  fairValue: 0,
  weightedAverageCost: 0,
};

export interface IAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    BTC?: ICurrencyDetail;
    ETH?: ICurrencyDetail;
    USDT?: ICurrencyDetail;
    USDC?: ICurrencyDetail;
  };
}
