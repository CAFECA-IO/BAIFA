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
  // Info: (20240201 - Julian) 從 DB 撈出所有 currencies 的資料
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
      currencyName: `${currencies.name}`,
      rank: 0, // ToDo: (20240125 - Julian) 討論去留
      riskLevel: 'LOW_RISK', // ToDo: (20240125 - Julian) 需要參考 codes Table 並補上 riskLevel 的轉換
    };
  });

  prisma.$connect();
  res.status(200).json(result);
}
