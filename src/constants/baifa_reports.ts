export type IBaifaReports =
  | 'Balance Sheets'
  | 'Comprehensive Income Statements'
  | 'Statements of Cash Flow'
  | 'Statements of Red Flags';

export type IBaifaReportsConstant = {
  BALANCE_SHEETS: IBaifaReports;
  COMPREHENSIVE_INCOME_STATEMENTS: IBaifaReports;
  STATEMENTS_OF_CASH_FLOW: IBaifaReports;
  STATEMENTS_OF_RED_FLAGS: IBaifaReports;
};

export const BaifaReports: IBaifaReportsConstant = {
  BALANCE_SHEETS: 'Balance Sheets',
  COMPREHENSIVE_INCOME_STATEMENTS: 'Comprehensive Income Statements',
  STATEMENTS_OF_CASH_FLOW: 'Statements of Cash Flow',
  STATEMENTS_OF_RED_FLAGS: 'Statements of Red Flags',
};
