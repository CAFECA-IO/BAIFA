// 008 - GET /app/chains/:chain_id/block/:block_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {DEFAULT_PAGE, ITEM_PER_PAGE} from '@/constants/config';
import {
  ITransactionList,
  IDisplayTransaction,
} from '@/interfaces/transaction';
import prisma from '@/lib/utils/prisma';

type ResponseData = ITransactionList;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240116 - Julian) 解構 URL 參數，同時進行類型轉換
  const chainId = 
    typeof req.query.chain_id === 'string' ? parseInt(req.query.chain_id) : undefined;
  const block_id =
    typeof req.query.block_id === 'string' ? parseInt(req.query.block_id) : undefined;
  // Info: (20240221 - Julian) query string
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : DEFAULT_PAGE;
  const offset =
    typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : ITEM_PER_PAGE;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const start_date =
    typeof req.query.start_date === 'string' && parseInt(req.query.start_date, 10) > 0
      ? parseInt(req.query.start_date, 10)
      : undefined;
  const end_date =
    typeof req.query.end_date === 'string' && parseInt(req.query.end_date, 10) > 0
      ? parseInt(req.query.end_date, 10)
      : undefined;

  try {
    // Info: (20240125 - Julian) 計算分頁的 skip 與 take
    const skip = page > 0 ? (page - 1) * offset : 0; // Info: (20240319 - Liz) 跳過前面幾筆
    const take = offset; // Info: (20240319 - Liz) 取幾筆

    // Info: (20240119 - Julian) 從 blocks Table 撈出 block_id 對應的 block hash
    const blockHash = await prisma.blocks.findFirst({
      where: {
        chain_id: chainId,
        number: block_id,
      },
      select: {
        hash: true,
      },
    });

    // Info: (20240222 - Julian) 查詢條件
    const where = {
      block_hash: blockHash?.hash,
      // Info: (20240222 - Julian) 日期區間
      created_timestamp: {
        gte: start_date,
        lte: end_date,
      },
      // Info: (20240222 - Julian) 關鍵字
      hash: search ? {contains: search} : undefined,
    };

    // Info: (20240119 - Julian) 再從 transactions 撈出位於 block_id 下的所有 transaction 的資料
    // Info: (20240219 - Julian) 如果 blockHash 不存在，則回傳空陣列
    const transactions = blockHash
      ? await prisma.transactions.findMany({
          where,
          select: {
            chain_id: true,
            hash: true,
            created_timestamp: true,
            type: true,
            status: true,
          },
          // Info: (20240222 - Julian) 排序方式：
          orderBy: [
            // Info: (20240314 - Julian) 1. created_timestamp 由 sort 決定
            {created_timestamp: sort},
            // Info: (20240314 - Julian) 2. id 排序和 created_timestamp 一致
            {id: sort},
          ],
          // Info: (20240125 - Julian) 分頁
          skip: skip,
          take: take,
        })
      : [];

    // Info: (20240222 - Julian) 計算總筆數
    const countOfTransaction = blockHash ? await prisma.transactions.count({where}) : 0;

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
    const transactionList: IDisplayTransaction[] = transactions.map(transaction => {
      // Info: (20240205 - Julian) 找出對應的 type 和 status
      const type =
        typeList.find(code => code.value === parseInt(transaction.type ?? ''))?.meaning ?? '';
      const status =
        statusList.find(code => code.value === parseInt(transaction.status ?? ''))?.meaning ?? '';

      return {
        id: `${transaction.hash}`,
        chainId: `${transaction.chain_id}`,
        createdTimestamp: transaction.created_timestamp ?? 0,
        type: type,
        status: status,
      };
    });

    // Info: (20240222 - Julian) 計算 totalPages
    const totalPages = Math.ceil(countOfTransaction / offset);

    // Info: (20240222 - Julian) 組合回傳資料
    const result: ITransactionList = {
      transactions: transactionList,
      totalPages: totalPages,
    };

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get transactions', error);
    res.status(500).json({transactions: [], totalPages: 0});
  } finally {
    await prisma.$disconnect();
  }
}
