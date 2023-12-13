import {ITransaction} from './transaction';

export interface IInteractionItem {
  id: string;
  type: 'address' | 'contract';
  chainId: string;
  createdTimestamp: number;
  transactionHistoryData: ITransaction[];
  publicTag: string[];
}
