export type IAPIName =
  | 'BALANCE_SHEET'
  | 'COMPREHENSIVE_INCOME_STATEMENTS'
  | 'STATEMENTS_OF_CASH_FLOW'
  | 'STATEMENTS_OF_RED_FLAGS'
  | 'EXCHANGE_RATES';

export interface IAPINameConstant {
  BALANCE_SHEET: IAPIName;
  COMPREHENSIVE_INCOME_STATEMENTS: IAPIName;
  STATEMENTS_OF_CASH_FLOW: IAPIName;
  EXCHANGE_RATES: IAPIName;
  //STATEMENTS_OF_RED_FLAGS: IAPIName;
}

export const APIName: IAPINameConstant = {
  BALANCE_SHEET: 'BALANCE_SHEET',
  COMPREHENSIVE_INCOME_STATEMENTS: 'COMPREHENSIVE_INCOME_STATEMENTS',
  STATEMENTS_OF_CASH_FLOW: 'STATEMENTS_OF_CASH_FLOW',
  EXCHANGE_RATES: 'EXCHANGE_RATES',
};

export const APIURL = {
  BALANCE_SHEET: 'https://api.tidebit-defi.com/balance-sheet',
  COMPREHENSIVE_INCOME_STATEMENTS: 'https://api.tidebit-defi.com/comprehensive-income',
  STATEMENTS_OF_CASH_FLOW: 'https://api.tidebit-defi.com/cash-flow',
  EXCHANGE_RATES: 'https://api.tidebit-defi.com/exchange-rates',

  WEBSITE_RESERVE: 'https://api.tidebit-defi.com/public/reserve',
};
