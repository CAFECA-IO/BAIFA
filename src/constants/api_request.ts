export type IAPIName =
  | 'BALANCE_SHEET'
  | 'COMPREHENSIVE_INCOME_STATEMENTS'
  | 'STATEMENTS_OF_CASH_FLOWS'
  | 'STATEMENTS_OF_RED_FLAGS';

export interface IAPINameConstant {
  BALANCE_SHEET: IAPIName;
  COMPREHENSIVE_INCOME_STATEMENTS: IAPIName;
  //STATEMENTS_OF_CASH_FLOWS: IAPIName;
  //STATEMENTS_OF_RED_FLAGS: IAPIName;
}

export const APIName: IAPINameConstant = {
  BALANCE_SHEET: 'BALANCE_SHEET',
  COMPREHENSIVE_INCOME_STATEMENTS: 'COMPREHENSIVE_INCOME_STATEMENTS',
};

export const APIURL = {
  BALANCE_SHEET: 'https://api.tidebit-defi.com/balance-sheet',
  COMPREHENSIVE_INCOME_STATEMENTS: 'https://api.tidebit-defi.com/comprehensive-income',
  EXCHANGE_RATES: 'https://api.tidebit-defi.com/exchange-rates',
};
