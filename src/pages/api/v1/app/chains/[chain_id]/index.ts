// 005 - GET /app/chains/:chain_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {IChain} from '../../../../../../interfaces/chain';
import prisma from '../../../../../../../prisma/client';

type ResponseData = IChain | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chain_id === 'string' ? parseInt(req.query.chain_id) : undefined;

  try {
    // Info: (20240118 - Julian) 從 DB 撈出 chainData
    const chainData = await prisma.chains.findUnique({
      where: {
        id: chain_id,
      },
      select: {
        id: true,
        chain_name: true,
      },
    });

    // Info: (20240118 - Julian) 轉換成 API 要的格式
    const result: ResponseData = chainData
      ? {
          chainId: `${chainData.id}`,
          chainName: `${chainData.chain_name}`,
        }
      : // Info: (20240118 - Julian) 如果沒有找到資料，回傳 undefined
        undefined;

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch chain data: ', error);
    res.status(500).json(undefined);
  } finally {
    await prisma.$disconnect();
  }
}
