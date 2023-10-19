import {IRiskLevel, RiskLevel} from '../constants/risk_level';

export interface ICurrency {
  currencyId: string;
  currencyName: string;
  price: number;
  volumeIn24h: number;
  unit: string;
  totalAmount: number;
  holders: number;
  totalTransfers: number;
  redPlag: number;
  riskLevel: IRiskLevel;
}

export const dummyCurrencyData: ICurrency[] = [
  {
    currencyId: 'btc',
    currencyName: 'Bitcoin',
    price: 27755.4,
    volumeIn24h: 138,
    unit: 'BTC',
    totalAmount: 19388600,
    holders: 29564,
    totalTransfers: 48010097,
    redPlag: 2000,
    riskLevel: RiskLevel.HIGH_RISK,
  },
  {
    currencyId: 'eth',
    currencyName: 'Ethereum',
    price: 1000.0,
    volumeIn24h: 105,
    unit: 'ETH',
    totalAmount: 11388600,
    holders: 23019,
    totalTransfers: 31092807,
    redPlag: 1700,
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    currencyId: 'isun',
    currencyName: 'iSunCloud',
    price: 500.0,
    volumeIn24h: 105,
    unit: 'BOLT',
    totalAmount: 10982624,
    holders: 9919,
    totalTransfers: 24992807,
    redPlag: 100,
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    currencyId: 'bnb',
    currencyName: 'BNB',
    price: 6840.44,
    volumeIn24h: 93,
    unit: 'BNB',
    totalAmount: 18092499,
    holders: 10373,
    totalTransfers: 24262807,
    redPlag: 1020,
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    currencyId: 'usdt',
    currencyName: 'Tether',
    price: 1.0,
    volumeIn24h: 832,
    unit: 'USDT',
    totalAmount: 27099243,
    holders: 40387,
    totalTransfers: 29802417,
    redPlag: 1003,
    riskLevel: RiskLevel.LOW_RISK,
  },
];
