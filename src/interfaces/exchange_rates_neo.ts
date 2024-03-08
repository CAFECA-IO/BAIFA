export interface IExchangeRateInfo {
  buyPrice: string;
  sellPrice: string;
  fairValue: string;
  timestamp: number;
  date: string;
}

export interface IExchangeRates {
  ETH: IExchangeRateInfo[];
  BTC: IExchangeRateInfo[];
  USDT: IExchangeRateInfo[];
  USDC: IExchangeRateInfo[];
}

export interface IExchangeRatesResponse {
  reportType: string;
  reportID: string;
  reportName: string;
  reportStartTime: number;
  reportEndTime: number;
  exchangeRates: IExchangeRates;
}
