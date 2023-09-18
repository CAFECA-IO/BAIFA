import {IBalanceSheet} from './balance_sheet';
import {IComprehensiveIncomeStatements} from './comprehensive_income_statements';
import {IStatementsOfCashFlows} from './statements_of_cash_flows';
import {IExchangeRates} from './exchange_rates';

export interface IResult {
  success: boolean;
  data?: IBalanceSheet | IComprehensiveIncomeStatements | IStatementsOfCashFlows | IExchangeRates;
  reason?: string;
}
