import {ITransaction} from './transaction';
import {ICommonData} from './common_data';

export interface IRedFlag extends ICommonData {
  // chainName: string; // TODO: Info:(20240201 - Julian) 可能移除
  redFlagType: string;
}

export interface IRedFlagListForCurrency {
  redFlagData: IRedFlag[];
  chainName: string;
  totalPages: number;
  redFlagTypes: string[];
  redFlagTypeCodeMeaningObj: {[key: string]: string};
}

export interface IRedFlagSearchResult extends IRedFlag {
  interactedAddresses: {
    id: string;
    chainId: string;
  }[]; // Info:(20231228 - Julian) 被警示交易的交易對象
}

export interface IRedFlagDetail extends IRedFlagSearchResult {
  unit: string;
  totalAmount: string; // Info:(20231228 - Julian) 交易總金額
  transactionHistoryData: ITransaction[]; // Info:(20231228 - Julian) 被警示的交易記錄
}

export interface IRedFlagOfAddress {
  redFlagData: IRedFlag[];
  redFlagCount: number;
  totalPage: number;
  allRedFlagTypes: string[];
}

export interface IRedFlagPage {
  redFlagData: IRedFlag[];
  totalPages: number;
  allRedFlagTypes: string[];
  redFlagTypeCodeMeaningObj: {[key: string]: string};
}
