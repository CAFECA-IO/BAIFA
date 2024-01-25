// 018 - GET /app/currencies/:currency_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../lib/utils/prismaUtils';

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type HolderData = {
  addressId: string;
  holdingAmount: number;
  holdingPercentage: number;
  publicTag: string[];
};

type TransactionHistoryData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  from: AddressInfo[];
  to: AddressInfo[];
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type ResponseData = {
  currencyId: string;
  currencyName: string;
  rank: number;
  chainIcon: string;
  holderCount: number;
  price: number;
  volumeIn24h: number;
  unit: string;
  totalAmount: number;
  holders: HolderData[];
  totalTransfers: number;
  flaggingCount: number;
  riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
  transactionHistoryData: TransactionHistoryData[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;

  const currencyData = await prisma.currencies.findUnique({
    where: {
      id: currency_id,
    },
    select: {
      id: true,
      name: true,
      holder_count: true,
      price: true,
      volume_in_24h: true,
      total_transfers: true,
      total_amount: true,
      risk_level: true,
    },
  });

  // ToDo: (20240125 - Julian) 如何透過 currency_id 取得 chainIcon 資料?
  // ToDo: (20240125 - Julian) 如何取得 holders 資料?
  // ToDo: (20240125 - Julian) 如何取得 transactionHistoryData 資料?

  const result: ResponseData = currencyData
    ? {
        currencyId: currencyData.id,
        currencyName: currencyData.name,
        rank: 1, // ToDo: (20240125 - Julian) 討論去留
        chainIcon: '/currencies/btc.svg', // ToDo: (20240125 - Julian) 補上這個欄位
        holderCount: currencyData.holder_count,
        price: currencyData.price,
        volumeIn24h: currencyData.volume_in_24h,
        unit: 'BTC', // ToDo: (20240125 - Julian) 補上這個欄位
        totalAmount: currencyData.total_amount,
        holders: [], // ToDo: (20240125 - Julian) 補上這個欄位
        totalTransfers: currencyData.total_transfers,
        flaggingCount: 24, // ToDo: (20240125 - Julian) 補上這個欄位
        riskLevel: 'LOW_RISK', // ToDo: (20240125 - Julian) 需要參考 codes Table 並補上 riskLevel 的轉換
        transactionHistoryData: [], // ToDo: (20240125 - Julian) 補上這個欄位
      }
    : {
        currencyId: '',
        currencyName: '',
        rank: 1,
        chainIcon: '',
        holderCount: 0,
        price: 0,
        volumeIn24h: 0,
        unit: '',
        totalAmount: 0,
        holders: [
          {
            'addressId': '0x356f9537631A773Ab9069fEc25f74Cd884132776',
            'holdingAmount': 248597,
            'holdingPercentage': 1.28,
            'publicTag': ['PUBLIC_TAG.BINANCE_COLDWALLET'],
          },
          {
            'addressId': '0x356f9537631A773Ab9069fEc25f74Cd884132776',
            'holdingAmount': 178010,
            'holdingPercentage': 0.92,
            'publicTag': ['PUBLIC_TAG.BINANCE_COLDWALLET'],
          },
        ],
        totalTransfers: 0,
        flaggingCount: 0,
        riskLevel: 'LOW_RISK',
        transactionHistoryData: [],
      };
  /* 
  const result: ResponseData = {
    'currencyId': 'btc',
    'currencyName': 'Bitcoin',
    'rank': 1,
    'chainIcon': '/currencies/btc.svg',
    'holderCount': 324,
    'price': 27755.4,
    'volumeIn24h': 14867304472,
    'unit': 'BTC',
    'totalAmount': 19388600,
    'holders': [
      {
        'addressId': '0x356f9537631A773Ab9069fEc25f74Cd884132776',
        'holdingAmount': 248597,
        'holdingPercentage': 1.28,
        'publicTag': ['PUBLIC_TAG.BINANCE_COLDWALLET'],
      },
      {
        'addressId': '0x356f9537631A773Ab9069fEc25f74Cd884132776',
        'holdingAmount': 178010,
        'holdingPercentage': 0.92,
        'publicTag': ['PUBLIC_TAG.BINANCE_COLDWALLET'],
      },
      {
        'addressId': '0x356f9537631A773Ab9069fEc25f74Cd884132776',
        'holdingAmount': 117351,
        'holdingPercentage': 0.61,
        'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
      },
      {
        'addressId': '0x356f9537631A773Ab9069fEc25f74Cd884132776',
        'holdingAmount': 93109,
        'holdingPercentage': 0.48,
        'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
      },
      {
        'addressId': '0x356f9537631A773Ab9069fEc25f74Cd884132776',
        'holdingAmount': 62352,
        'holdingPercentage': 0.32,
        'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
      },
      // other holders
    ],
    'totalTransfers': 48010097,
    'flaggingCount': 24,
    'riskLevel': 'HIGH_RISK',
    'transactionHistoryData': [
      {
        'id': '916841',
        'chainId': 'btc',
        'createdTimestamp': 1679978987,
        'from': [{'type': 'address', 'address': '0x356f9537631A773Ab9069fEc25f74Cd884132776'}], // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        'to': [{'type': 'contract', 'address': '0x356f9537631A773Ab9069fEc25f74Cd884132776'}],
        'type': 'Evidence',
        'status': 'FAILED',
      },
      {
        'id': '914025',
        'chainId': 'btc',
        'createdTimestamp': 1687909392,
        'from': [{'type': 'address', 'address': '0x356f9537631A773Ab9069fEc25f74Cd884132776'}], // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        'to': [{'type': 'contract', 'address': '0x356f9537631A773Ab9069fEc25f74Cd884132776'}],
        'type': 'Crypto Currency',
        'status': 'SUCCESS',
      },
      // ...other transaction history
    ],
  }; */

  res.status(200).json(result);
}
