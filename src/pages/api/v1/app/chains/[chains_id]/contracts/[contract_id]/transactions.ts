// 025 - GET /app/chains/:chain_id/contracts/:contract_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {AddressType, IAddressInfo} from '../../../../../../../../interfaces/address_info';
import {ITransactionHistorySection} from '../../../../../../../../interfaces/transaction';
import {ITEM_PER_PAGE} from '../../../../../../../../constants/config';
import prisma from '../../../../../../../../../prisma/client';

type ResponseData = ITransactionHistorySection;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240216 - Julian) 解構 URL 參數，同時進行類型轉換
  const contractId = typeof req.query.contract_id === 'string' ? req.query.contract_id : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
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
    // Info: (20240216 - Julian) 計算分頁的 skip 與 take
    const skip = (page - 1) * ITEM_PER_PAGE; // (20240216 - Julian) 跳過前面幾筆
    const take = ITEM_PER_PAGE; // (20240216 - Julian) 取幾筆

    // Info: (20240222 - Julian) 排序
    const sorting = sort === 'SORTING.OLDEST' ? 'asc' : 'desc';

    // Info: (20240226 - Julian) 查詢和 contract 相關的 transaction
    const queryConditon = {
      related_addresses: {
        hasSome: [`${contractId}`],
      },
      // Info: (20240216 - Julian) 日期區間
      created_timestamp: {
        gte: start_date,
        lte: end_date,
      },
      // Info: (20240226 - Julian) 關鍵字
      hash: search ? {contains: search} : undefined,
    };

    // Info: (20240226 - Julian) 撈出總筆數
    const transactionCount = await prisma.transactions.count({
      where: {
        related_addresses: {
          hasSome: [`${contractId}`],
        },
      },
    });
    // Info: (20240226 - Julian) 用於計算頁數
    const filteredTransactionCount = await prisma.transactions.count({where: queryConditon});

    // Info: (20240216 - Julian) 撈出 transaction data
    const transactionData = contractId
      ? await prisma.transactions.findMany({
          where: queryConditon,
          // Info: (20240226 - Julian) 撈出的欄位
          select: {
            chain_id: true,
            hash: true,
            created_timestamp: true,
            from_address: true,
            to_address: true,
            type: true,
            status: true,
          },
          // Info: (20240226 - Julian) 排序方式：
          orderBy: [
            // Info: (20240226 - Julian) 1. created_timestamp 由 sorting 決定
            {created_timestamp: sorting},
            // Info: (20240226 - Julian) 2. id 排序和 created_timestamp 一致
            {id: sorting},
          ],
          // Info: (20240125 - Julian) 分頁
          skip: skip,
          take: take,
        })
      : [];

    // Info: (20240216 - Julian) 從 codes Table 撈出 transaction type 和 status
    const transactionCodes = await prisma.codes.findMany({
      where: {
        table_name: 'transactions',
      },
      select: {
        table_column: true,
        value: true,
        meaning: true,
      },
    });

    // Info: (20240216 - Julian) 轉換 type list
    const typeList = transactionCodes.filter(code => code.table_column === 'type');
    // Info: (20240216 - Julian) 轉換 status list
    const statusList = transactionCodes.filter(code => code.table_column === 'status');

    // Info: (20240130 - Julian) 撈出所有 address
    const allAddress = await prisma.addresses.findMany({
      select: {
        address: true,
      },
    });
    const allAddressArray = allAddress.map(address => address.address);

    const transactionList = transactionData.map(transaction => {
      // Info: (20240216 - Julian) from address 轉換
      const fromAddressesRaw = transaction.from_address ? transaction.from_address.split(',') : [];
      // Info: (20240216 - Julian) 如果 address 為 null 就過濾掉
      const fromAddresses = fromAddressesRaw.filter(address => address !== 'null');
      // Info: (20240216 - Julian) 掃描 fromAddresses，如果 `addresses` table 有對應的 address 資料，就輸出 'address'，否則輸出 'contract'
      const fromType = fromAddresses.map(address => {
        return allAddressArray.includes(address) ? AddressType.ADDRESS : AddressType.CONTRACT;
      });
      const from: IAddressInfo[] = fromAddresses.map((address, index) => {
        return {
          type: fromType[index],
          address: address,
        };
      });

      // Info: (20240216 - Julian) to address 轉換
      const toAddressesRaw = transaction.to_address ? transaction.to_address.split(',') : [];
      // Info: (20240216 - Julian) 如果 address 為 null 就過濾掉
      const toAddresses = toAddressesRaw.filter(address => address !== 'null');
      // Info: (20240216 - Julian) 掃描 toAddresses，如果 `addresses` table 有對應的 address 資料，就輸出 'address'，否則輸出 'contract'
      const toType = toAddresses.map(address => {
        return allAddressArray.includes(address) ? AddressType.ADDRESS : AddressType.CONTRACT;
      });
      const to: IAddressInfo[] = fromAddresses.map((address, index) => {
        return {
          type: toType[index],
          address: address,
        };
      });

      // Info: (20240216 - Julian) 找出對應的 type 和 status
      const type =
        typeList.find(code => code.value === parseInt(transaction.type ?? ''))?.meaning ?? '';
      const status =
        statusList.find(code => code.value === parseInt(transaction.status ?? ''))?.meaning ?? '';

      return {
        id: `${transaction.hash}`,
        chainId: `${transaction.chain_id}`,
        createdTimestamp: transaction.created_timestamp ?? 0,
        from: from,
        to: to,
        type: type,
        status: status,
      };
    });

    // Info: (20240226 - Julian) 計算總頁數
    const totalPages = Math.ceil(filteredTransactionCount / ITEM_PER_PAGE);

    // Info: (20240226 - Julian) 組合回傳資料
    const result: ResponseData = {
      transactions: transactionList,
      totalPages: totalPages,
      transactionCount: transactionCount,
    };

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get transaction history', error);
    res.status(500).json({transactions: [], totalPages: 0, transactionCount: 0});
  } finally {
    await prisma.$disconnect();
  }
}
