// 005 - GET /app/chains/:chains_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../lib/utils/prismaUtils';
import {IChainDetail} from '../../../../../../interfaces/chain';

type ResponseData = IChainDetail | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const chains_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;

  // Info: (20240118 - Julian) 從 DB 撈出 chainData
  const chainData = await prisma.chains.findUnique({
    where: {
      id: chains_id,
    },
    select: {
      id: true,
      chain_name: true,
    },
  });

  // Info: (20240216 - Julian) 計算 blocks 和 transactions 的總數
  const blocks = await prisma.blocks.count({
    where: {
      chain_id: chains_id,
    },
  });

  const transactions = await prisma.transactions.count({
    where: {
      chain_id: chains_id,
    },
  });

  // Info: (20240118 - Julian) 轉換成 API 要的格式
  const result: ResponseData = chainData
    ? {
        chainId: `${chainData.id}`,
        chainName: `${chainData.chain_name}`,
        blocks: blocks,
        transactions: transactions,
      }
    : // Info: (20240118 - Julian) 如果沒有找到資料，回傳 undefined
      undefined;

  prisma.$connect();
  res.status(200).json(result);
}
