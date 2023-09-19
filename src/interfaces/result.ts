import {IBalanceSheet} from './balance_sheet';
import {IComprehensiveIncomeStatements} from './comprehensive_income_statements';
import {IExchangeRates} from './exchange_rates';

export interface IResult {
  success: boolean;
  data?: IBalanceSheet | IComprehensiveIncomeStatements | IExchangeRates;
  reason?: string;
}
