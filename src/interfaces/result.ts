import {IBalanceSheet} from './balance_sheet';
import {IComprehensiveIncomeStatements} from './comprehensive_income_statements';

export interface IResult {
  success: boolean;
  data?: IBalanceSheet | IComprehensiveIncomeStatements;
  reason?: string;
}
