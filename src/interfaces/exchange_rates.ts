export interface IExchangeRateInfo {
  date: string;
  timestamp: number;
  buyPrice: number;
  sellPrice: number;
  fairValue: number;
}

export interface IExchangeRates {
  BTC: IExchangeRateInfo[];
  ETH: IExchangeRateInfo[];
  USDT: IExchangeRateInfo[];
  USDC: IExchangeRateInfo[];
}
