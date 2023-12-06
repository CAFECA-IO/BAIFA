// /app/chains

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  chainId: string;
  chainName: string;
  chainIcon: string;
  blocks: number;
  transactions: number;
}[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = [
    {
      'chainId': 'eth',
      'chainName': 'Ethereum',
      'chainIcon': '/currencies/eth.svg',
      'blocks': 56789,
      'transactions': 123456,
    },
    {
      'chainId': 'bit',
      'chainName': 'Bitcoin',
      'chainIcon': '/currencies/bit.svg',
      'blocks': 67890,
      'transactions': 987654,
    },
    {
      'chainId': 'isun',
      'chainName': 'iSunCloud',
      'chainIcon': '/currencies/isun.svg',
      'blocks': 17313,
      'transactions': 917361,
    },
    {
      'chainId': 'usdt',
      'chainName': 'Tether',
      'chainIcon': '/currencies/usdt.svg',
      'blocks': 34567,
      'transactions': 567890,
    },
    {
      'chainId': 'bnb',
      'chainName': 'Binance',
      'chainIcon': '/currencies/bnb.svg',
      'blocks': 45678,
      'transactions': 789012,
    },
    // ... other chains
  ];

  res.status(200).json(result);
}
