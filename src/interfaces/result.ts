import {IBalanceSheet} from './balance_sheet';
import {IComprehensiveIncomeStatements} from './comprehensive_income_statements';
import {IStatementsOfCashFlow} from './statements_of_cash_flow';
import {IExchangeRates} from './exchange_rates';
import {IWebsiteReserve} from './website_reserve';
import {IPromotion} from './promotion';

export interface IResult {
  success: boolean;
  data?:
    | IBalanceSheet
    | IComprehensiveIncomeStatements
    | IStatementsOfCashFlow
    | IExchangeRates
    | IWebsiteReserve
    | IPromotion;
  reason?: string;
}
