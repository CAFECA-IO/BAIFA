// 019 - GET /app/currencies/:currency_id/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../lib/utils/prismaUtils';
import {IRedFlagOfCurrency} from '../../../../../../interfaces/red_flag';

type ResponseData = IRedFlagOfCurrency[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240129 - Julian) 解構 URL 參數
  const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;

  if (!currency_id) {
    return res.status(400).json([]);
  }

  try {
    // Info: (20240129 - Julian) 取得 currency 資料
    const currencyData = await prisma.currencies.findUnique({
      where: {
        id: currency_id,
      },
      select: {
        name: true,
        chain_id: true,
      },
    });

    // Info: (20240227 - Liz) 根據 currency_id 取得 red_flags 資料
    const redFlagData = currency_id
      ? await prisma.red_flags.findMany({
          where: {
            currency_id: currency_id,
          },
          select: {
            id: true,
            chain_id: true,
            red_flag_type: true,
            created_timestamp: true,
          },
        })
      : [];

    // Info: (20240227 - Liz) 組合回傳資料
    const result: ResponseData = redFlagData.map(redFlag => {
      return {
        id: `${redFlag.id}`,
        chainId: `${redFlag.chain_id}`,
        chainName: `${currencyData?.name}`,
        redFlagType: `${redFlag.red_flag_type}`,
        createdTimestamp: redFlag.created_timestamp ?? 0,
      };
    });

    prisma.$connect();
    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error in /app/currencies/:currency_id/red_flags', error);
    res.status(500).json([] as ResponseData);
  }
}
