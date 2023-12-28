import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';
import {ITransaction} from './transaction';

export interface IRedFlag {
  id: string;
  chainId: string;
  chainIcon: string;
  addressId: string;
  redFlagType: IRedFlagType;
  createdTimestamp: number; // 被警示的日期
}

export interface IRedFlagDetail extends IRedFlag {
  address: string;
  interactedAddresses: {
    id: string;
    chainId: string;
  }[]; // 被警示交易的交易對象
  totalAmount: number; // 交易總金額
  transactionData: ITransaction[]; // 被警示的交易記錄
}
