import {IRiskLevel} from '../constants/risk_level';
import {IRedFlag} from './red_flag';
import {IDisplayTransaction} from './transaction';

export interface IHolder {
  addressId: string;
  // holdingAmount: number;
  holdingAmount: string;
  holdingPercentage: number;
  holdingBarWidth: number;
  publicTag: string[];
}

export interface ICurrency {
  currencyId: string;
  currencyName: string;
  rank: number;
  riskLevel: IRiskLevel;
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

// Info: (今天 - Liz) 後端回傳的 totalAmount 是 string 故新增 ICurrencyDetailString
export interface ICurrencyDetailString extends ICurrency {
  price: number;
  volumeIn24h: number;
  unit: string;
  totalAmount: string;
  holderCount: number;
  holders: IHolder[];
  totalTransfers: number;
  flagging: IRedFlag[];
  flaggingCount: number;
  transactionHistoryData: IDisplayTransaction[];
}
