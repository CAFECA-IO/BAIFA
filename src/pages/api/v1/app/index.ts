// 001 - GET /app

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';

type ResponseData = {
  chains: number;
  cryptoCurrencies: number;
  blackList: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240119 - Julian) 計算這三個 Table 的資料筆數
  const chainsLength = await prisma.chains.count();
  const currenciesLength = await prisma.currencies.count();
  const blackListLength = await prisma.black_lists.count();

  const result: ResponseData = {
    chains: chainsLength,
    cryptoCurrencies: currenciesLength,
    blackList: blackListLength,
  };

  res.status(200).json(result);
}
