import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';
import {IRiskLevel, RiskLevel} from '../constants/risk_level';

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
        addressId: '302841',
        holdingAmount: 248597,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '329301',
        holdingAmount: 178010,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '399283',
        holdingAmount: 117351,
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
        addressId: '372840',
        holdingAmount: 192597,
        type: 'Unknown User',
      },
      {
        addressId: '338261',
        holdingAmount: 148800,
        type: 'Unknown User',
      },
      {
        addressId: '399209',
        holdingAmount: 117019,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '392709',
        holdingAmount: 79352,
        type: 'Unknown User',
      },
    ],
    totalTransfers: 31092807,
    flagging: [
      RedFlagType.MULTIPLE_RECEIVES,
      RedFlagType.MULTIPLE_TRANSFER,
      RedFlagType.MULTIPLE_WITHDRAW,
    ],
    riskLevel: RiskLevel.MEDIUM_RISK,
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
        addressId: '345082',
        holdingAmount: 180291,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '398251',
        holdingAmount: 161829,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '324801',
        holdingAmount: 149028,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '345288',
        holdingAmount: 102392,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '382984',
        holdingAmount: 62895,
        type: 'Binance-coldwallet',
      },
    ],
    totalTransfers: 24992807,
    flagging: [RedFlagType.LARGE_DEPOSIT],
    riskLevel: RiskLevel.LOW_RISK,
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
        addressId: '398251',
        holdingAmount: 238012,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '338261',
        holdingAmount: 192040,
        type: 'Unknown User',
      },
      {
        addressId: '392709',
        holdingAmount: 180252,
        type: 'Unknown User',
      },
      {
        addressId: '399283',
        holdingAmount: 175219,
        type: 'Unknown User',
      },
      {
        addressId: '382984',
        holdingAmount: 169528,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '329301',
        holdingAmount: 138011,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '324801',
        holdingAmount: 93028,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '345288',
        holdingAmount: 90525,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '302841',
        holdingAmount: 88524,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '399209',
        holdingAmount: 58390,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '345082',
        holdingAmount: 43197,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '372840',
        holdingAmount: 35972,
        type: 'Unknown User',
      },
    ],
    totalTransfers: 29802417,
    flagging: [RedFlagType.MULTIPLE_TRANSFER],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    currencyId: 'bnb',
    currencyName: 'BNB',
    rank: 5,
    price: 6840.44,
    volumeIn24h: 552770616,
    unit: 'BNB',
    totalAmount: 18092499,
    holders: [
      {
        addressId: '372840',
        holdingAmount: 52597,
        type: 'Unknown User',
      },
      {
        addressId: '329301',
        holdingAmount: 40211,
        type: 'Unknown User',
      },
      {
        addressId: '345288',
        holdingAmount: 17291,
        type: 'Binance-coldwallet',
      },
      {
        addressId: '382984',
        holdingAmount: 8885,
        type: 'Binance-coldwallet',
      },
    ],
    totalTransfers: 24262807,
    flagging: [RedFlagType.HIGH_RISK_LOCATION],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
];
