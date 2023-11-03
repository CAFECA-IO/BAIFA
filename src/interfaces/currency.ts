import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';
import {IRiskLevel, RiskLevel} from '../constants/risk_level';
import {ITransaction, getDummyTransactionData} from './transaction';

export interface IHolder {
  addressId: string;
  holdingAmount: number;
  type: string;
}
export interface ICurrency {
  currencyId: string;
  currencyName: string;
  rank: number;
  price: number;
  volumeIn24h: number;
  unit: string;
  totalAmount: number;
  holders: IHolder[];
  totalTransfers: number;
  flagging: IRedFlagType[];
  riskLevel: IRiskLevel;
  transactions: ITransaction[];
}

export const dummyCurrencyData: ICurrency[] = [
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
        type: 'Binance-coldwallet',
      },
      {
        addressId: '110132',
        holdingAmount: 178010,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '112840',
        holdingAmount: 117351,
        type: 'Unknown User',
      },
      {
        addressId: '114007',
        holdingAmount: 93109,
        type: 'Unknown User',
      },
      {
        addressId: '115588',
        holdingAmount: 62352,
        type: 'Unknown User',
      },
    ],
    totalTransfers: 48010097,
    flagging: [
      RedFlagType.LARGE_WITHDRAW,
      RedFlagType.LARGE_DEPOSIT,
      RedFlagType.LARGE_TRANSFER,
      RedFlagType.MULTIPLE_RECEIVES,
      RedFlagType.MULTIPLE_WITHDRAW,
    ],
    riskLevel: RiskLevel.HIGH_RISK,
    transactions: getDummyTransactionData('btc'),
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
        type: 'Unknown User',
      },
      {
        addressId: '120999',
        holdingAmount: 148800,
        type: 'Unknown User',
      },
      {
        addressId: '123201',
        holdingAmount: 117019,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '121700',
        holdingAmount: 79352,
        type: 'Unknown User',
      },
      {
        addressId: '122810',
        holdingAmount: 57019,
        type: 'Binance-coldwallet',
      },
    ],
    totalTransfers: 31092807,
    flagging: [
      RedFlagType.MULTIPLE_RECEIVES,
      RedFlagType.MULTIPLE_TRANSFER,
      RedFlagType.MULTIPLE_WITHDRAW,
    ],
    riskLevel: RiskLevel.MEDIUM_RISK,
    transactions: getDummyTransactionData('eth'),
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
        type: 'Binance-coldwallet',
      },
      {
        addressId: '130025',
        holdingAmount: 161829,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '130089',
        holdingAmount: 149028,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '130294',
        holdingAmount: 102392,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '130682',
        holdingAmount: 62895,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '134902',
        holdingAmount: 39281,
        type: 'Binance-coldwallet',
      },
    ],
    totalTransfers: 24992807,
    flagging: [RedFlagType.LARGE_DEPOSIT],
    riskLevel: RiskLevel.LOW_RISK,
    transactions: getDummyTransactionData('isun'),
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
        type: 'Binance-coldwallet',
      },
      {
        addressId: '140007',
        holdingAmount: 192040,
        type: 'Unknown User',
      },
      {
        addressId: '140050',
        holdingAmount: 180252,
        type: 'Unknown User',
      },
      {
        addressId: '140333',
        holdingAmount: 175219,
        type: 'Unknown User',
      },
      {
        addressId: '144055',
        holdingAmount: 169528,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '144338',
        holdingAmount: 138011,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '146605',
        holdingAmount: 93028,
        type: 'Binance-coldwallet',
      },
    ],
    totalTransfers: 29802417,
    flagging: [RedFlagType.MULTIPLE_TRANSFER],
    riskLevel: RiskLevel.LOW_RISK,
    transactions: getDummyTransactionData('usdt'),
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
        type: 'Unknown User',
      },
      {
        addressId: '150472',
        holdingAmount: 40211,
        type: 'Unknown User',
      },
    ],
    totalTransfers: 24262807,
    flagging: [RedFlagType.HIGH_RISK_LOCATION],
    riskLevel: RiskLevel.MEDIUM_RISK,
    transactions: getDummyTransactionData('bnb'),
  },
];
