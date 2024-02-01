import {IRedFlagType} from '../constants/red_flag_type';
import {ITransaction} from './transaction';
import {ICommonData} from './common_data';

export interface IRedFlag extends ICommonData {
  chainName: string;
  redFlagType: IRedFlagType;
}

export interface ISearchRedFlag extends IRedFlag {
  interactedAddresses: {
    id: string;
    chainId: string;
  }[]; // Info:(20231228 - Julian) 被警示交易的交易對象
}

export interface IRedFlagDetail extends ISearchRedFlag {
  unit: string;
  totalAmount: number; // Info:(20231228 - Julian) 交易總金額
  transactionHistoryData: ITransaction[]; // Info:(20231228 - Julian) 被警示的交易記錄
}
