// 009 - GET /app/chains/:chain_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {DEFAULT_PAGE, ITEM_PER_PAGE} from '@/constants/config';
import {IDisplayTransaction, ITransactionList} from '@/interfaces/transaction';
import prisma from '@/lib/utils/prisma';

type ResponseData = ITransactionList;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chain_id === 'string' ? parseInt(req.query.chain_id) : undefined;
  // Info: (20240222 - Julian) query string
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

  // Info: (20240119 - Julian) 判斷是否有 addressId
  const addressIdA = typeof req.query.addressIdA === 'string' ? req.query.addressIdA : undefined;
  const addressIdB = typeof req.query.addressIdB === 'string' ? req.query.addressIdB : undefined;

  try {
    // Info: (20240119 - Julian) 計算分頁的 skip 與 take
    const skip = page > 0 ? (page - 1) * offset : 0; // Info: (20240319 - Liz) 跳過前面幾筆
    const take = offset; // Info: (20240319 - Liz) 取幾筆

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

    // Info: (20240205 - Julian) 轉換 status list
    const statusList = codes.filter(code => code.table_column === 'status');
    // Info: (20240205 - Julian) 轉換 type list
    const typeList = codes.filter(code => code.table_column === 'type');

    if (addressIdA && addressIdB) {
      // Info: (20240117 - Julian) ========= Transaction History between two addresses =========

      // Info: (20240119 - Julian) 查詢條件
      const queryCondition = {
        chain_id: chain_id,
        // Info: (20240118 - Julian) 選出 from_address 或 to_address 有包含 addressId 的交易
        OR: [
          // 1. from_address = addressIdA and to_address = addressIdB
          {from_address: addressIdA, to_address: addressIdB},
          // 2. from_address = addressIdB and to_address = addressIdA
          {from_address: addressIdB, to_address: addressIdA},
        ],
        created_timestamp: {
          gte: start_date,
          lte: end_date,
        },
        hash: search ? {contains: search} : undefined,
      };
      // Info: (20240216 - Julian) 拿出 transactions 筆數
      const countBetweenAddresses = await prisma.transactions.count({where: queryCondition});
      // Info: (20240216 - Julian) 拿出 transactions 資料
      const transactionListBetweenAddresses = await prisma.transactions.findMany({
        where: queryCondition,
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
        // Info: (20240119 - Julian) 分頁
        skip: skip,
        take: take,
      });

      const transactionsBetweenAddresses: IDisplayTransaction[] =
        transactionListBetweenAddresses.map(transaction => {
          // Info: (20240205 - Julian) 找出對應的 type 和 status
          const type =
            typeList.find(code => code.value === parseInt(transaction.type ?? ''))?.meaning ?? '';
          const status =
            statusList.find(code => code.value === parseInt(transaction.status ?? ''))?.meaning ??
            '';
          return {
            id: `${transaction.hash}`,
            chainId: `${transaction.chain_id}`,
            createdTimestamp: transaction?.created_timestamp ?? 0,
            type: type,
            status: status,
          };
        });

      // Info: (20240216 - Julian) 計算 totalPages
      const totalPagesBetweenAddresses = Math.ceil(countBetweenAddresses / offset);

      // Info: (20240216 - Julian) 組合回傳資料
      const resultBetweenAddresses: ITransactionList = {
        transactions: transactionsBetweenAddresses,
        totalPages: totalPagesBetweenAddresses,
      };

      res.status(200).json(resultBetweenAddresses);
    } else {
      // Info: (20240117 - Julian) ========= Transactions of a chain =========

      // Info: (20240216 - Julian) 查詢條件
      const where = {
        chain_id: chain_id,
        // Info: (20240119 - Julian) 日期區間
        created_timestamp: {
          gte: start_date,
          lte: end_date,
        },
        // Info: (20240222 - Julian) 關鍵字
        hash: search ? {contains: search} : undefined,
      };
      // Info: (20240216 - Julian) 拿出 transactions 筆數
      const countOfChain = await prisma.transactions.count({where});
      // Info: (20240216 - Julian) 拿出 transactions 資料
      const transactionListOfChain = await prisma.transactions.findMany({
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
          // Info: (20240222 - Julian) 2. id 排序和 created_timestamp 一致
          {id: sort},
        ],
        // Info: (20240119 - Julian) 分頁
        skip: skip,
        take: take,
      });

      const transactionsOfChain: IDisplayTransaction[] = transactionListOfChain.map(transaction => {
        // Info: (20240205 - Julian) 找出對應的 type 和 status
        const status =
          statusList.find(code => code.value === parseInt(transaction.status ?? ''))?.meaning ?? '';
        const type =
          typeList.find(code => code.value === parseInt(transaction.type ?? ''))?.meaning ?? '';

        return {
          id: `${transaction.hash}`,
          chainId: `${transaction.chain_id}`,
          createdTimestamp: transaction?.created_timestamp ?? 0,
          type: type,
          status: status,
        };
      });

      // Info: (20240216 - Julian) 計算 totalPages
      const totalPagesOfChain = Math.ceil(countOfChain / ITEM_PER_PAGE);

      // Info: (20240216 - Julian) 組合回傳資料
      const resultOfChain: ITransactionList = {
        transactions: transactionsOfChain,
        totalPages: totalPagesOfChain,
      };

      res.status(200).json(resultOfChain);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get transactions', error);
    res.status(500).json({transactions: [], totalPages: 0});
  } finally {
    await prisma.$disconnect();
  }
}
