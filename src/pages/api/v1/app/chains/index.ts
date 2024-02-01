// 004 - GET /app/chains

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../lib/utils/prismaUtils';
import {IChain} from '../../../../../interfaces/chain';

type ResponseData = IChain[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info:(20240118 - Julian) 從 DB 撈出所有 chain 的資料
  const chains = await prisma.chains.findMany({
    select: {
      id: true,
      chain_name: true,
    },
  });

  const blockCount = await prisma.blocks.count();
  const transactionCount = await prisma.transactions.count();

  // Info:(20240118 - Julian) 將撈出來的資料轉換成 API 要的格式
  const result: ResponseData = chains.map(chain => {
    return {
      chainId: `${chain.id}`,
      chainName: `${chain.chain_name}`,
      blocks: blockCount,
      transactions: transactionCount,
    };
  });

  prisma.$connect();
  res.status(200).json(result);
}
