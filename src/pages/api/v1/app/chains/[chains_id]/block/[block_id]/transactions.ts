// 008 - GET /app/chains/:chain_id/blocks/:block_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {
  ITEM_PER_PAGE,
  FAILED_TRANSACTION_STATUS_CODE,
} from '../../../../../../../../constants/config';
import {IDisplayTransaction} from '../../../../../../../../interfaces/transaction';

type ResponseData = IDisplayTransaction[];

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
        gte: start_date,
        lte: end_date,
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

  // Info: (20240205 - Julian) 從 codes Table 撈出 type 和 status
  const codes = await prisma.codes.findMany({
    where: {
      table_name: 'transactions',
    },
    select: {
      table_column: true,
      value: true,
      meaning: true,
    },
  });

  // Info: (20240205 - Julian) 轉換 type list
  const typeList = codes.filter(code => code.table_column === 'type');
  // Info: (20240205 - Julian) 轉換 status list
  const statusList = codes.filter(code => code.table_column === 'status');

  // Info: (20240118 - Julian) 轉換成 API 要的格式
  const result: ResponseData = transactions.map(transaction => {
    // Info: (20240205 - Julian) 找出對應的 type 和 status
    const type =
      typeList.find(code => code.value === parseInt(transaction.type ?? ''))?.meaning ?? '';
    const status =
      statusList.find(code => code.value === parseInt(transaction.status ?? ''))?.meaning ?? '';

    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transaction.created_timestamp ?? 0,
      type: type,
      status: status,
    };
  });

  prisma.$connect();
  res.status(200).json(result);
}
