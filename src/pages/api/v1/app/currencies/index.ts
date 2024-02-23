// 017 - GET /app/currencies

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../lib/utils/prismaUtils';
import {ICurrency} from '../../../../../interfaces/currency';

type ResponseData = ICurrency[];

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

  // Info: (20240223 - Liz) 從 codes Table 撈出 risk_level 的 value 和 meaning 的對照表為一個物件陣列
  const riskLevelCodes = await prisma.codes.findMany({
    where: {
      table_name: 'currencies',
      table_column: 'risk_level',
    },
    select: {
      value: true,
      meaning: true,
    },
  });
  // Info: (20240223 - Liz) 遍歷物件陣列 轉換成物件
  const riskLevelCodesObj: {
    [key: string]: string;
  } = {};
  riskLevelCodes.forEach(item => {
    if (item.value !== null) {
      riskLevelCodesObj[item.value] = item.meaning as string;
    }
  });

  const result: ResponseData = currencies.map(currencies => {
    // Info: (20240223 - Liz) 將資料庫傳來的 risk_level 轉換成對應的 meaning
    const riskLevel = currencies?.risk_level
      ? riskLevelCodesObj[currencies.risk_level]
      : 'Unknown Risk Level';

    return {
      currencyId: currencies.id,
      currencyName: `${currencies.name}`,
      rank: 0, // ToDo: (20240125 - Julian) 討論去留
      riskLevel: riskLevel,
    };
  });

  prisma.$connect();
  res.status(200).json(result);
}
