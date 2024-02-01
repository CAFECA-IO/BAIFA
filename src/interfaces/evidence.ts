import {ITransaction} from './transaction';
import {ICommonData} from './common_data';

export interface IEvidence extends ICommonData {
  evidenceAddress: string;
}
export interface IEvidenceDetail extends IEvidence {
  state: 'Active' | 'Inactive';
  creatorAddressId: string;
  content: string;
  transactionHistoryData: ITransaction[];
}
