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
    // blockGroup: [ { _count: { chain_id: 1342 }, chain_id: 8017 },{ _count: { chain_id: 999 }, chain_id: 58017 } ]

    // Info: (240709 - Liz) 建立 chainBlocks 物件用來分類 chain_id 的 block 數量
    const chainBlocks: {[key: number]: number} = {};
    blockGroup.forEach(block => {
      if (block.chain_id !== null) {
        chainBlocks[block.chain_id] = block._count.chain_id;
      }
    });

    // Info:(20240221 - Julian) 扁平化 blockGroup，輸出 number array
    // const blockCount = blockGroup.map(block => {
    //   return block._count.chain_id;
    // });

    // Info:(20240221 - Julian) 將相同 chainId 的 transaction 數量加總
    const transactionGroup = await prisma.transactions.groupBy({
      by: ['chain_id'],
      _count: {
        chain_id: true,
      },
    });

    // Info: (240709 - Liz) 建立 chainTransactions 物件用來分類 chain_id 的 transaction 數量
    const chainTransactions: {[key: number]: number} = {};
    transactionGroup.forEach(transaction => {
      if (transaction.chain_id !== null) {
        chainTransactions[transaction.chain_id] = transaction._count.chain_id;
      }
    });

    // Info:(20240221 - Julian) 扁平化 transactionGroup，輸出 number array
    // const transactionCount = transactionGroup.map(transaction => {
    //   return transaction._count.chain_id;
    // });

    // Info:(20240118 - Julian) 將撈出來的資料轉換成 API 要的格式
    const result: ResponseData = chains.map(chain => {
      return {
        chainId: `${chain.id}`,
        chainName: `${chain.chain_name}`,
        // blocks: blockCount[index],
        // transactions: transactionCount[index],
        blocks: chainBlocks[chain.id] || 0,
        transactions: chainTransactions[chain.id] || 0,
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
