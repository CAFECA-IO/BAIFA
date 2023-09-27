export interface ICurrencyData {
  currencyId: string;
  currencyName: string;
  price: number;
  volumeIn24h: number;
  unit: string;
  totalAmount: number;
  holders: number;
  totalTransfers: number;
  redPlag: number;
  stabilityLevel: 'MEDIUM_RISK' | 'HIGH_RISK' | 'LOW_RISK';
}

export const dummyCurrencyData: ICurrencyData[] = [
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
    stabilityLevel: 'HIGH_RISK',
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
    stabilityLevel: 'MEDIUM_RISK',
  },
  {
    currencyId: 'bolt',
    currencyName: 'BOLT',
    price: 500.0,
    volumeIn24h: 105,
    unit: 'BOLT',
    totalAmount: 10982624,
    holders: 9919,
    totalTransfers: 24992807,
    redPlag: 100,
    stabilityLevel: 'LOW_RISK',
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
    stabilityLevel: 'MEDIUM_RISK',
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
    stabilityLevel: 'LOW_RISK',
  },
];
