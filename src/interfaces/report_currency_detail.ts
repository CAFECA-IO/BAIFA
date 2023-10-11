export type ICurrencyType = 'CRYPTOCURRENCY' | 'FIAT';

export interface ICurrencyDetail {
  name: string;
  amount: number;
  fairValue: number;
  currencyType: ICurrencyType;
  weightedAverageCost: number;
}
