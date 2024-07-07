// 004 - GET /app/chains

import type {NextApiRequest, NextApiResponse} from 'next';
import {IChain} from '@/interfaces/chain';
import prisma from '@/lib/utils/prisma';

type ResponseData = IChain[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    // Info:(20240118 - Julian) 從 DB 撈出所有 chain 的資料
    const chains = await prisma.chains.findMany({
      select: {
        id: true,
        chain_name: true,
      },
    });

    // Info:(20240221 - Julian) 將相同 chainId 的 block 數量加總
    const blockGroup = await prisma.blocks.groupBy({
      by: ['chain_id'],
      _count: {
        chain_id: true,
      },
    });
    // Info:(20240221 - Julian) 扁平化 blockGroup，輸出 number array
    const blockCount = blockGroup.map(block => {
      return block._count.chain_id;
    });

    // Info:(20240221 - Julian) 將相同 chainId 的 transaction 數量加總
    const transactionGroup = await prisma.transactions.groupBy({
      by: ['chain_id'],
      _count: {
        chain_id: true,
      },
    });
    // Info:(20240221 - Julian) 扁平化 transactionGroup，輸出 number array
    const transactionCount = transactionGroup.map(transaction => {
      return transaction._count.chain_id;
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

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch all chains data: ', error);
    res.status(500).json([]);
  } finally {
    await prisma.$disconnect();
  }
}
