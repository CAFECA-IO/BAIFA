// 008 - GET /app/chains/:chain_id/blocks/:block_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {ITEM_PER_PAGE} from '../../../../../../../../constants/config';

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  type: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
};

type ResponseData = TransactionData[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240116 - Julian) 解構 URL 參數，同時進行類型轉換
  const block_id =
    typeof req.query.block_id === 'string' ? parseInt(req.query.block_id) : undefined;
  const start_date =
    typeof req.query.start_date === 'string' ? parseInt(req.query.start_date) : undefined;
  const end_date =
    typeof req.query.end_date === 'string' ? parseInt(req.query.end_date) : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;

  // Info: (20240125 - Julian) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // (20240119 - Julian) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // (20240119 - Julian) 取幾筆

  // Info: (20240125 - Julian) 將 timestamp 轉換成 Date 物件
  const startDate = start_date ? new Date(start_date * 1000) : undefined;
  const endDate = end_date ? new Date(end_date * 1000) : undefined;

  // Info: (20240119 - Julian) 從 blocks Table 撈出 block_id 對應的 blockhash
  const blockHash = await prisma.blocks.findUnique({
    where: {
      number: block_id,
    },
    select: {
      hash: true,
    },
  });

  // Info: (20240119 - Julian) 再從 transactions 撈出位於 block_id 下的所有 transaction 的資料
  const transactions = await prisma.transactions.findMany({
    where: {
      block_hash: blockHash?.hash,
      // Info: (20240125 - Julian) 日期區間
      created_timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      chain_id: true,
      created_timestamp: true,
      type: true,
      status: true,
    },
    // Info: (20240125 - Julian) 從新到舊排序
    orderBy: {
      created_timestamp: 'desc',
    },
    // Info: (20240125 - Julian) 分頁
    skip: skip,
    take: take,
  });

  // Info: (20240118 - Julian) 轉換成 API 要的格式
  const result: ResponseData = transactions.map(transaction => {
    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transaction.created_timestamp.getTime() / 1000,
      type: transaction.type, // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 type 的轉換
      status: 'SUCCESS', // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 status 的轉換
    };
  });

  res.status(200).json(result);
}
