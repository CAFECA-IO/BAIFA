// 001 - GET /app

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {IPromotion} from '../../../../interfaces/promotion';

type ResponseData = IPromotion;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  try {
    // Info: (20240119 - Julian) 計算這三個 Table 的資料筆數
    const chainsLength = await prisma.chains.count();
    const currenciesLength = await prisma.currencies.count();
    // Updated: (20240216) Count public tags where tag_type equals "9" as blacklist
    const blackListLength = await prisma.public_tags.count({
      where: {
        tag_type: '9',
      },
    });
    const result: ResponseData = {
      chains: chainsLength,
      cryptoCurrencies: currenciesLength,
      blackList: blackListLength,
    };

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240216 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('app request', error);
    res.status(500).json({} as ResponseData);
  }
}
