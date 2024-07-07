import {IDisplayTransaction} from '@/interfaces/transaction';
import {ICommonData} from '@/interfaces/common_data';
import {IBalanceSheetsNeo} from '@/interfaces/balance_sheets_neo';
import {IComprehensiveIncomeNeo} from '@/interfaces/comprehensive_income_neo';
import {ICashFlowNeo} from '@/interfaces/cash_flow_neo';

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

export const dummyEvidenceDetail: IEvidenceDetail = {
  id: '',
  chainId: '',
  evidenceAddress: '',
  state: '',
  creatorAddressId: '',
  createdTimestamp: 0,
  transactionHistoryData: [],
};
