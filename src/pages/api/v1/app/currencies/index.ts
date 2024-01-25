// 017 - GET /app/currencies

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../lib/utils/prismaUtils';

type ResponseData = {
  currencyId: string;
  currencyName: string;
  rank: number;
  riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
}[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  const currencies = await prisma.currencies.findMany({
    select: {
      id: true,
      risk_level: true,
      name: true,
    },
  });

  const result: ResponseData = currencies.map(currencies => {
    return {
      currencyId: currencies.id,
      currencyName: currencies.name,
      rank: 1, // ToDo: (20240125 - Julian) 討論去留
      riskLevel: 'LOW_RISK', // ToDo: (20240125 - Julian) 需要參考 codes Table 並補上 riskLevel 的轉換
    };
  });

  /* 
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
  ]; */
  res.status(200).json(result);
}
