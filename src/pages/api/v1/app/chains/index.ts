// 004 - GET /app/chains

import type {NextApiRequest, NextApiResponse} from 'next';

import {getPrismaInstance} from '../../../../../lib/utils/prismaUtils';

type ResponseData = {
  chainId: number; // Info:(20240118 - Julian) 根據 DB 做調整，原本是 string;
  chainName: string;
  chainIcon: string;
  blocks: number;
  transactions: number;
}[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  const chains = await prisma.chains.findMany({
    select: {
      id: true,
      chain_name: true,
      chain_icon: true,
    },
  });

  const result: ResponseData = chains.map(chain => {
    return {
      chainId: chain.id,
      chainName: chain.chain_name,
      chainIcon: chain.chain_icon,
      // ToDo: (20240118 - Julian) 等 DB 補上這兩個欄位
      blocks: 0,
      transactions: 0,
    };
  });

  res.status(200).json(result);

  /* 
  const result: ResponseData = [
    {
      'chainId': 'eth',
      'chainName': 'Ethereum',
      'chainIcon': '/currencies/eth.svg',
      'blocks': 56789,
      'transactions': 123456,
    },
    {
      'chainId': 'bit',
      'chainName': 'Bitcoin',
      'chainIcon': '/currencies/btc.svg',
      'blocks': 67890,
      'transactions': 987654,
    },
    {
      'chainId': 'isun',
      'chainName': 'iSunCloud',
      'chainIcon': '/currencies/isun.svg',
      'blocks': 17313,
      'transactions': 917361,
    },
    {
      'chainId': 'usdt',
      'chainName': 'Tether',
      'chainIcon': '/currencies/usdt.svg',
      'blocks': 34567,
      'transactions': 567890,
    },
    {
      'chainId': 'bnb',
      'chainName': 'Binance',
      'chainIcon': '/currencies/bnb.svg',
      'blocks': 45678,
      'transactions': 789012,
    },
    // ... other chains
  ];

  res.status(200).json(result); */
}
