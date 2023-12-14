import {IRiskLevel, RiskLevel} from '../constants/risk_level';
import {IRedFlag, getDummyRedFlag} from './red_flag';
import {ITransaction, getDummyTransactionData} from './transaction';

export interface IHolder {
  addressId: string;
  holdingAmount: number;
  holdingPercentage: number;
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
  holders: IHolder[];
  totalTransfers: number;
  flagging: IRedFlag[];
  flaggingCount: number;
  transactionHistoryData: ITransaction[];
}

export const dummyCurrencyData: ICurrencyDetail[] = [
  {
    currencyId: 'btc',
    currencyName: 'Bitcoin',
    rank: 1,
    price: 27755.4,
    volumeIn24h: 14867304472,
    unit: 'BTC',
    totalAmount: 19388600,
    holders: [
      {
        addressId: '110029',
        holdingAmount: 248597,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '110132',
        holdingAmount: 178010,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '112840',
        holdingAmount: 117351,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '114007',
        holdingAmount: 93109,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '115588',
        holdingAmount: 62352,
        publicTag: [],
        holdingPercentage: 1.3,
      },
    ],
    totalTransfers: 48010097,
    flaggingCount: 15,
    flagging: getDummyRedFlag('btc', '112840', 31),
    riskLevel: RiskLevel.HIGH_RISK,
    transactionHistoryData: getDummyTransactionData('btc'),
  },
  {
    currencyId: 'eth',
    currencyName: 'Ethereum',
    rank: 2,
    price: 1000.0,
    volumeIn24h: 6666377248,
    unit: 'ETH',
    totalAmount: 11388600,
    holders: [
      {
        addressId: '120499',
        holdingAmount: 192597,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '120999',
        holdingAmount: 148800,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '123201',
        holdingAmount: 117019,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '121700',
        holdingAmount: 79352,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '122810',
        holdingAmount: 57019,
        publicTag: [],
        holdingPercentage: 1.3,
      },
    ],
    totalTransfers: 31092807,
    flaggingCount: 15,
    flagging: getDummyRedFlag('eth', '120499', 17),
    riskLevel: RiskLevel.MEDIUM_RISK,
    transactionHistoryData: getDummyTransactionData('eth'),
  },
  {
    currencyId: 'isun',
    currencyName: 'iSunCloud',
    rank: 3,
    price: 500.0,
    volumeIn24h: 4583013964,
    unit: 'BOLT',
    totalAmount: 10982624,
    holders: [
      {
        addressId: '130008',
        holdingAmount: 180291,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '130025',
        holdingAmount: 161829,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '130089',
        holdingAmount: 149028,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '130294',
        holdingAmount: 102392,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '130682',
        holdingAmount: 62895,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '134902',
        holdingAmount: 39281,
        publicTag: [],
        holdingPercentage: 1.3,
      },
    ],
    totalTransfers: 24992807,
    flaggingCount: 15,
    flagging: getDummyRedFlag('isun', '134902', 6),
    riskLevel: RiskLevel.LOW_RISK,
    transactionHistoryData: getDummyTransactionData('isun'),
  },
  {
    currencyId: 'usdt',
    currencyName: 'Tether',
    rank: 4,
    price: 1.0,
    volumeIn24h: 3447744807,
    unit: 'USDT',
    totalAmount: 27099243,
    holders: [
      {
        addressId: '140002',
        holdingAmount: 238012,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '140007',
        holdingAmount: 192040,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '140050',
        holdingAmount: 180252,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '140333',
        holdingAmount: 175219,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '144055',
        holdingAmount: 169528,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '144338',
        holdingAmount: 138011,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '146605',
        holdingAmount: 93028,
        publicTag: [],
        holdingPercentage: 1.3,
      },
    ],
    totalTransfers: 29802417,
    flaggingCount: 15,
    flagging: getDummyRedFlag('usdt', '140007', 25),
    riskLevel: RiskLevel.LOW_RISK,
    transactionHistoryData: getDummyTransactionData('usdt'),
  },
  {
    currencyId: 'bnb',
    currencyName: 'Binace Coin',
    rank: 5,
    price: 6840.44,
    volumeIn24h: 552770616,
    unit: 'BNB',
    totalAmount: 18092499,
    holders: [
      {
        addressId: '150381',
        holdingAmount: 52597,
        publicTag: [],
        holdingPercentage: 1.3,
      },
      {
        addressId: '150472',
        holdingAmount: 40211,
        publicTag: [],
        holdingPercentage: 1.3,
      },
    ],
    totalTransfers: 24262807,
    flaggingCount: 15,
    flagging: getDummyRedFlag('bnb', '150381', 2),
    riskLevel: RiskLevel.MEDIUM_RISK,
    transactionHistoryData: getDummyTransactionData('bnb'),
  },
];
