import {IAddressInfo} from '@/interfaces/address_info';
import {ICommonData} from '@/interfaces/common_data';

export interface IDisplayTransaction extends ICommonData {
  status: string;
  type: string;
}

export interface ITransactionSearchResult extends ICommonData {
  hash: string;
}

export interface ITransaction extends IDisplayTransaction {
  from: IAddressInfo[];
  to: IAddressInfo[];
}

export interface ITransactionData {
  transactions: IDisplayTransaction[];
  transactionCount: number;
  totalPage: number;
}

export interface ITransactionDetail extends ITransaction {
  hash: string;
  blockId: string;
  evidenceId?: string;
  input?: string;
  value: number;
  fee: number;
  flaggingRecords: {
    redFlagId: string;
    redFlagType: string;
  }[];
  unit: string;
}

export interface ITransactionList {
  transactions: IDisplayTransaction[];
  totalPages: number;
}

export interface ITransactionHistorySection {
  transactions: IDisplayTransaction[];
  totalPages: number;
  transactionCount: number;
}

export const dummyTransactionDetail: ITransactionDetail = {
  id: '',
  chainId: '',
  createdTimestamp: 0,
  status: '',
  type: '',
  from: [],
  to: [],
  hash: '',
  blockId: '',
  evidenceId: '',
  value: 0,
  fee: 0,
  flaggingRecords: [],
  unit: '',
};
