export type IBaifaReports =
  | 'Balance Sheets'
  | 'Income Statements'
  | 'Statements of Cash Flows'
  | 'Statements of Red Flags';

export type IBaifaReportsConstant = {
  BALANCE_SHEETS: IBaifaReports;
  COMPREHENSIVE_INCOME_STATEMENTS: IBaifaReports;
  STATEMENTS_OF_CASH_FLOWS: IBaifaReports;
  STATEMENTS_OF_RED_FLAGS: IBaifaReports;
};

export const BaifaReports: IBaifaReportsConstant = {
  BALANCE_SHEETS: 'Balance Sheets',
  COMPREHENSIVE_INCOME_STATEMENTS: 'Income Statements',
  STATEMENTS_OF_CASH_FLOWS: 'Statements of Cash Flows',
  STATEMENTS_OF_RED_FLAGS: 'Statements of Red Flags',
};
