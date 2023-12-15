// 018 - GET /app/currencies/:currency_id

import type {NextApiRequest, NextApiResponse} from 'next';

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

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'currencyId': 'btc',
    'currencyName': 'Bitcoin',
    'rank': 1,
    'price': 27755.4,
    'volumeIn24h': 14867304472,
    'unit': 'BTC',
    'totalAmount': 19388600,
    'holders': [
      {
        'addressId': '110029',
        'holdingAmount': 248597,
        'holdingPercentage': 1.28,
        'publicTag': ['PUBLIC_TAG.BINANCE_COLDWALLET'],
      },
      {
        'addressId': '110132',
        'holdingAmount': 178010,
        'holdingPercentage': 0.92,
        'publicTag': ['PUBLIC_TAG.BINANCE_COLDWALLET'],
      },
      {
        'addressId': '112840',
        'holdingAmount': 117351,
        'holdingPercentage': 0.61,
        'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
      },
      {
        'addressId': '114007',
        'holdingAmount': 93109,
        'holdingPercentage': 0.48,
        'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
      },
      {
        'addressId': '115588',
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
        'from': [{'type': 'address', 'address': '115588'}], // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        'to': [{'type': 'contract', 'address': '311382'}],
        'type': 'Evidence',
        'status': 'FAILED',
      },
      {
        'id': '914025',
        'chainId': 'btc',
        'createdTimestamp': 1687909392,
        'from': [{'type': 'address', 'address': '114007'}], // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        'to': [{'type': 'contract', 'address': '311025'}],
        'type': 'Crypto Currency',
        'status': 'SUCCESS',
      },
      // ...other transaction history
    ],
  };

  res.status(200).json(result);
}
