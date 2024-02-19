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

  // Info:(20240219 - Julian) 從 DB 撈出所有 block，再找出對應 chainId 的 block 數量
  const allBLocks = await prisma.blocks.findMany({
    select: {
      chain_id: true,
    },
  });
  const blockCount = chains.map(chain => {
    return allBLocks.filter(block => block.chain_id === chain.id).length;
  });

  // Info:(20240219 - Julian) 從 DB 撈出所有 transaction，再找出對應 chainId 的 transaction 數量
  const allTransactions = await prisma.transactions.findMany({
    select: {
      chain_id: true,
    },
  });
  const transactionCount = chains.map(chain => {
    return allTransactions.filter(transaction => transaction.chain_id === chain.id).length;
  });

  // Info:(20240118 - Julian) 將撈出來的資料轉換成 API 要的格式
  const result: ResponseData = chains.map((chain, index) => {
    return {
      chainId: `${chain.id}`,
      chainName: `${chain.chain_name}`,
      blocks: blockCount[index],
      transactions: transactionCount[index],
    };
  });

  prisma.$connect();
  res.status(200).json(result);
}
