// 009 - GET /app/chains/:chain_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../lib/utils/prismaUtils';
import {ITEM_PER_PAGE} from '../../../../../../../constants/config';
import {IDisplayTransaction} from '../../../../../../../interfaces/transaction';

type ResponseData = IDisplayTransaction[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const start_date =
    typeof req.query.start_date === 'string' ? parseInt(req.query.start_date) : undefined;
  const end_date =
    typeof req.query.end_date === 'string' ? parseInt(req.query.end_date) : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;

  // Info: (20240119 - Julian) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // (20240119 - Julian) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // (20240119 - Julian) 取幾筆

  // Info: (20240119 - Julian) 判斷是否有 addressId
  const addressId = typeof req.query.addressId === 'object' ? req.query.addressId : undefined;

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

  if (!addressId) {
    // Info: (20240117 - Julian) ========= Transactions of a chain =========
    const transactionsOfChain = await prisma.transactions.findMany({
      where: {
        chain_id: chain_id,
        // Info: (20240119 - Julian) 日期區間
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
      // Info: (20240119 - Julian) 從新到舊排序
      orderBy: {
        created_timestamp: 'desc',
      },
      // Info: (20240119 - Julian) 分頁
      skip: skip,
      take: take,
    });

    const resultOfChain: ResponseData = transactionsOfChain.map(transaction => {
      // Info: (20240205 - Julian) 找出對應的 type 和 status
      const status =
        statusList.find(code => code.value === parseInt(transaction.status ?? ''))?.meaning ?? '';
      const type =
        typeList.find(code => code.value === parseInt(transaction.type ?? ''))?.meaning ?? '';

      return {
        id: `${transaction.id}`,
        chainId: `${transaction.chain_id}`,
        createdTimestamp: transaction?.created_timestamp ?? 0,
        type: type,
        status: status,
      };
    });

    prisma.$connect();
    res.status(200).json(resultOfChain);
  } else {
    // Info: (20240117 - Julian) ========= Transaction History bewteen two addresses =========
    const transactionsBetweenAddresses = await prisma.transactions.findMany({
      where: {
        chain_id: chain_id,
        OR: [
          // Info: (20240118 - Julian) 選出 from_address 或 to_address 有包含 addressId 的交易
          {from_address: {equals: addressId[0] || addressId[1]}},
          {to_address: {equals: addressId[0] || addressId[1]}},
        ],
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
      // Info: (20240119 - Julian) 從新到舊排序
      orderBy: {
        created_timestamp: 'desc',
      },
      // Info: (20240119 - Julian) 分頁
      skip: skip,
      take: take,
    });

    const resultBetweenAddresses: ResponseData = transactionsBetweenAddresses.map(transaction => {
      return {
        id: `${transaction.id}`,
        chainId: `${transaction.chain_id}`,
        createdTimestamp: transaction?.created_timestamp ?? 0,
        type: `${transaction.type}`, // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 type 的轉換
        status: `${transaction.status}`, // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 status 的轉換
      };
    });

    prisma.$connect();
    res.status(200).json(resultBetweenAddresses);
  }
}
