import {IAddressInfo} from './address_info';
import {ICommonData} from './common_data';

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
  transactions: ITransaction[];
  transactionCount: number;
}

export interface ITransactionDetail extends ITransaction {
  hash: string;
  blockId: string;
  evidenceId?: string;
  value: number;
  fee: number;
  flaggingRecords: {
    redFlagId: string;
    redFlagType: string;
  }[];
  unit: string;
}
