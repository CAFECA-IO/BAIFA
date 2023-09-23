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

export const defaultStatementCurrencyDetail: IStatementCurrencyDetail = {
  currencyType: 'CRYPTOCURRENCY',
  name: 'None',
  amount: 0,
  fairValue: 0,
  weightedAverageCost: 0,
};
