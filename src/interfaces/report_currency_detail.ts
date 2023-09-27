export type ICurrencyType = 'CRYPTOCURRENCY' | 'FIAT';

export interface ICurrencyDetail {
  name: string;
  amount: number;
  fairValue: number;
}

export interface IStatementCurrencyDetail extends ICurrencyDetail {
  currencyType: ICurrencyType;
  weightedAverageCost: number;
}
