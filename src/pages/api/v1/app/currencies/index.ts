// 017 - GET /app/currencies

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  currencyId: string;
  currencyName: string;
  rank: number;
  riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
}[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = [
    {
      'currencyId': 'btc',
      'currencyName': 'Bitcoin',
      'rank': 1,
      'riskLevel': 'HIGH_RISK',
    },
    {
      'currencyId': 'eth',
      'currencyName': 'Ethereum',
      'rank': 2,
      'riskLevel': 'MEDIUM_RISK',
    },
    {
      'currencyId': 'isun',
      'currencyName': 'iSunCloud',
      'rank': 3,
      'riskLevel': 'LOW_RISK',
    },
    {
      'currencyId': 'usdt',
      'currencyName': 'Tether',
      'rank': 4,
      'riskLevel': 'MEDIUM_RISK',
    },
    {
      'currencyId': 'bnb',
      'currencyName': 'Binace Coin',
      'rank': 5,
      'riskLevel': 'LOW_RISK',
    },
    // other currencies
  ];
  res.status(200).json(result);
}
