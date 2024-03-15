export interface IExchangeRateInfo {
  id: string;
  currency: string;
  buyPrice: number;
  sellPrice: number;
  fairValue: number;
  timestamp: number;
  date: string;
}

export interface IExchangeRates {
  ETH: IExchangeRateInfo[];
  BTC: IExchangeRateInfo[];
  USDT: IExchangeRateInfo[];
}
