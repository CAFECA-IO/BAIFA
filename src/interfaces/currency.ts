import {IRedFlag} from './red_flag';
import {IDisplayTransaction} from './transaction';

export interface IHolder {
  addressId: string;
  // holdingAmount: number;
  holdingAmount: string;
  // holdingPercentage: number;
  holdingPercentage: string;
  holdingBarWidth: number;
  publicTag: string[];
}

export interface ITop100Holders {
  holdersData: IHolder[];
  totalPages: number;
}

export interface ICurrency {
  currencyId: string;
  currencyName: string;
  rank: number;
  riskLevel: string;
}

export interface ICurrencyListPage {
  currencies: ICurrency[];
  totalPages: number;
  currencyTypes: string[];
  // currencyTypeCodeMeaningObj: {[key: string]: string};
}

export interface ICurrencyDetail extends ICurrency {
  price: number;
  volumeIn24h: number;
  unit: string;
  totalAmount: number;
  holderCount: number;
  holders: IHolder[];
  totalTransfers: number;
  flagging: IRedFlag[];
  flaggingCount: number;
  transactionHistoryData: IDisplayTransaction[];
}

// Info: (20240219 - Liz) 後端回傳的 totalAmount 是 string 故新增 ICurrencyDetailString
export interface ICurrencyDetailString extends ICurrency {
  chainId: string;
  price: number;
  volumeIn24h: number;
  unit: string;
  totalAmount: string;
  holderCount: number;
  // holders: IHolder[]; // Deprecated: (今天丟棄 - Liz)
  totalTransfers: number;
  flagging: IRedFlag[];
  flaggingCount: number;
  transactionHistoryData: IDisplayTransaction[];
}
