// 009 - GET /app/chains/:chain_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../lib/utils/prismaUtils';
import {ITEM_PER_PAGE} from '../../../../../../../constants/config';

type Transaction = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  type: string;
  status: string;
};

type ResponseData = Transaction[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
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

  // Info: (20240112 - Julian) 將 timestamp 轉換成 Date 物件
  const startDate = start_date ? new Date(start_date * 1000) : undefined;
  const endDate = end_date ? new Date(end_date * 1000) : undefined;

  // Info: (20240119 - Julian) 判斷是否有 addressId
  const addressId = typeof req.query.addressId === 'object' ? req.query.addressId : undefined;

  if (!addressId) {
    // Info: (20240117 - Julian) ========= Transactions of a chain =========
    const transactionsOfChain = await prisma.transactions.findMany({
      where: {
        chain_id: chain_id,
        // Info: (20240119 - Julian) 日期區間
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
      // Info: (20240119 - Julian) 從新到舊排序
      orderBy: {
        created_timestamp: 'desc',
      },
      // Info: (20240119 - Julian) 分頁
      skip: skip,
      take: take,
    });

    const resultOfChain: ResponseData = transactionsOfChain.map(transaction => {
      // Info: (20240130 - Julian) 日期轉換
      const createdTimestamp = transaction?.created_timestamp
        ? new Date(transaction?.created_timestamp).getDate() / 1000
        : 0;

      return {
        id: `${transaction.id}`,
        chainId: `${transaction.chain_id}`,
        createdTimestamp: createdTimestamp,
        type: `${transaction.type}`, // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 type 的轉換
        status: `${transaction.status}`, // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 status 的轉換
      };
    });

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
      // Info: (20240119 - Julian) 從新到舊排序
      orderBy: {
        created_timestamp: 'desc',
      },
      // Info: (20240119 - Julian) 分頁
      skip: skip,
      take: take,
    });

    const resultBetweenAddresses: ResponseData = transactionsBetweenAddresses.map(transaction => {
      // Info: (20240130 - Julian) 日期轉換
      const createdTimestamp = transaction?.created_timestamp
        ? new Date(transaction?.created_timestamp).getDate() / 1000
        : 0;

      return {
        id: `${transaction.id}`,
        chainId: `${transaction.chain_id}`,
        createdTimestamp: createdTimestamp,
        type: `${transaction.type}`, // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 type 的轉換
        status: `${transaction.status}`, // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 status 的轉換
      };
    });

    res.status(200).json(resultBetweenAddresses);
  }
}
