import {ITransaction} from './transaction';

export interface IEvidence {
  id: string;
  chainId: string;
  chainIcon: string;
  evidenceAddress: string;
  state: 'Active' | 'Inactive';
  creatorAddressId: string;
  createdTimestamp: number;
  content: string;
  transactionHistoryData: ITransaction[];
}
