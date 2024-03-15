import {IDisplayTransaction} from './transaction';
import {ICommonData} from './common_data';
import {IBalanceSheetsNeo} from './balance_sheets_neo';
import {IComprehensiveIncomeNeo} from './conprehensive_income_neo';
import {ICashFlowNeo} from './cash_flow_neo';

export interface IEvidence extends ICommonData {
  evidenceAddress: string;
}
export interface IEvidenceDetail extends IEvidence {
  state: string;
  creatorAddressId: string;
  transactionHistoryData: IDisplayTransaction[];
}

export interface IEvidenceBrief extends ICommonData {
  evidenceAddress: string;
  state: string;
  creatorAddressId: string;
  //content: string;
}

export interface IEvidenceContent {
  balanceSheet: IBalanceSheetsNeo;
  comprehensiveIncome: IComprehensiveIncomeNeo;
  cashFlow: ICashFlowNeo;
}
