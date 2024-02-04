import {IRiskLevel} from '../constants/risk_level';
import {IRedFlag} from './red_flag';
import {ITransaction} from './transaction';

export interface IHolder {
  addressId: string;
  holdingAmount: number;
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
  transactionHistoryData: ITransaction[];
}
