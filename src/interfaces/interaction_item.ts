import {ITransaction} from './transaction';

export interface IInteractionItem {
  id: string;
  type: 'address' | 'contract';
  chainId: string;
  createdTimestamp: number;
  transactionCount: number;
  transactionHistoryData: ITransaction[];
  publicTag: string[];
}
