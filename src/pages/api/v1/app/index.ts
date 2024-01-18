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

  let chains = 0;
  let cryptoCurrencies = 0;
  let blackList = 0;

  // Info:(20240118 - Julian) 撈出所有 chain 的資料
  const getChainsLength = prisma.chains
    .findMany({select: {id: true}})
    .then(result => (chains = result.length));

  // Info:(20240118 - Julian) 撈出所有 currencies 的資料
  const getCurrenciesLength = prisma.currencies
    .findMany({select: {id: true}})
    .then(result => (cryptoCurrencies = result.length));

  // Info:(20240118 - Julian) 撈出所有 blackList 的資料
  const getBlackListLength = prisma.black_lists
    .findMany({select: {id: true}})
    .then(result => (blackList = result.length));

  Promise.all([getChainsLength, getCurrenciesLength, getBlackListLength]).then(() => {
    // Info:(20240118 - Julian) 轉換成 API 要的格式
    const result: ResponseData = {
      chains,
      cryptoCurrencies,
      blackList,
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
