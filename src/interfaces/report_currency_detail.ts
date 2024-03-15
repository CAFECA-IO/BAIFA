export type ICurrencyType = 'CRYPTOCURRENCY' | 'FIAT';

export interface ICurrencyDetail {
  name: string;
  amount: number;
  fairValue: number;
  currencyType: ICurrencyType;
  weightedAverageCost: number;
}

export const defaultBreakdown = {
  name: '',
  amount: 0,
  fairValue: 0,
  currencyType: 'CRYPTOCURRENCY',
  weightedAverageCost: 0,
};
