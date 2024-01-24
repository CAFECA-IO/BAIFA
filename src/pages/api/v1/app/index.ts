// 001 - GET /app

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';

type ResponseData = {
  chains: number;
  cryptoCurrencies: number;
  blackList: number;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240119 - Julian) 計算這三個 Table 的資料筆數
  const chainsLength = prisma.chains.count();
  const currenciesLength = prisma.currencies.count();
  const blackListLength = prisma.black_lists.count();

  Promise.all([chainsLength, currenciesLength, blackListLength]).then(values => {
    const result: ResponseData = {
      chains: values[0],
      cryptoCurrencies: values[1],
      blackList: values[2],
    };
    res.status(200).json(result);
  });

  /* 
  const result: ResponseData = {
    'chains': 5,
    'cryptoCurrencies': 5,
    'blackList': 7,
  };
  res.status(200).json(result); */
}
