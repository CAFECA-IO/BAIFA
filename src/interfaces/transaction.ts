import {IRedFlagType} from '../constants/red_flag_type';
import {ICommonData} from './common_data';

export interface IDisplayTransaction extends ICommonData {
  status: string;
  type: string;
}

export interface ITransactionSearchResult extends ICommonData {
  hash: string;
}

export interface ITransaction extends IDisplayTransaction {
  from: {type: string; address: string}[];
  to: {type: string; address: string}[];
}

export interface ITransactionDetail extends ITransaction {
  hash: string;
  blockId: string;
  evidenceId?: string;
  value: number;
  fee: number;
  flaggingRecords: {
    redFlagId: string;
    redFlagType: IRedFlagType;
  }[];
  unit: string;
}
