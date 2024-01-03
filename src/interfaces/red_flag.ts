import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';
import {ITransaction} from './transaction';

export interface IRedFlag {
  id: string;
  chainId: string;
  chainIcon: string;
  addressId: string;
  redFlagType: IRedFlagType;
  createdTimestamp: number; // Info:(20231228 - Julian) 被警示的日期
}

export interface IRedFlagDetail extends IRedFlag {
  address: string;
  chainIcon: string;
  unit: string;
  interactedAddresses: {
    id: string;
    chainId: string;
  }[]; // Info:(20231228 - Julian) 被警示交易的交易對象
  totalAmount: number; // Info:(20231228 - Julian) 交易總金額
  transactionHistoryData: ITransaction[]; // Info:(20231228 - Julian) 被警示的交易記錄
}
