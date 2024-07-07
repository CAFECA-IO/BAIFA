// 001 - GET /app

import type {NextApiRequest, NextApiResponse} from 'next';
import {PUBLIC_TAGS_REFERENCE} from '@/constants/config';
import {IPromotion} from '@/interfaces/promotion';
import prisma from '@/lib/utils/prisma';

type ResponseData = IPromotion;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    // Info: (20240119 - Julian) 計算這三個 Table 的資料筆數
    const chainsLength = await prisma.chains.count();
    const currenciesLength = await prisma.currencies.count();
    // Info: (20240216 - Shirley) Count public tags where tag_type equals "9" as blacklist
    const blackListLength = await prisma.public_tags.count({
      where: {
        tag_type: PUBLIC_TAGS_REFERENCE.TAG_TYPE.BLACKLIST,
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
