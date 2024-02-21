import {IDisplayTransaction} from './transaction';
import {ICommonData} from './common_data';

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
  content: string;
}
