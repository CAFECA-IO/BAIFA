import {IBalanceSheet} from '@/interfaces/balance_sheet';
import {IComprehensiveIncomeStatements} from '@/interfaces/comprehensive_income_statements';
import {IStatementsOfCashFlow} from '@/interfaces/statements_of_cash_flow';
import {IExchangeRates} from '@/interfaces/exchange_rates';
import {IWebsiteReserve} from '@/interfaces/website_reserve';
import {IPromotion} from '@/interfaces/promotion';

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
