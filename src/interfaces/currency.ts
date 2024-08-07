import {IRedFlag} from '@/interfaces/red_flag';
import {IDisplayTransaction} from '@/interfaces/transaction';

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
  currencyId: number;
  currencyName: string;
  rank: number;
  riskLevel: string;
}

export interface ICurrencyListPage {
  currencies: ICurrency[];
  totalPages: number;
  chainNameTypes: string[];
  chainIdNameObj: {[key: string]: string};
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
  totalTransfers: number;
  flagging: IRedFlag[];
  flaggingCount: number;
  currencyIconId: string;
}

export interface ICurrencyWithIcon extends ICurrency {
  currencyIconId: string;
}

export interface ICurrencyList {
  currencies: ICurrencyWithIcon[];
  totalPages: number;
  chainNameTypes: string[];
  chainIdNameObj: {[key: string]: string};
}
