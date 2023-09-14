import {IBalanceSheet} from './balance_sheet';

export interface IResult {
  success: boolean;
  data?: IBalanceSheet;
  reason?: string;
}
