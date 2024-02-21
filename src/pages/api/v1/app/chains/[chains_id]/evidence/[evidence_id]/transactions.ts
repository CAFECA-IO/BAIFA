// 026 - GET /app/chains/:chain_id/evidence/:evidence_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {AddressType, IAddressInfo} from '../../../../../../../../interfaces/address_info';
import {IDisplayTransaction} from '../../../../../../../../interfaces/transaction';
import {ITEM_PER_PAGE} from '../../../../../../../../constants/config';

type ResponseData = IDisplayTransaction[] | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240219 - Julian) 解構 URL 參數，同時進行類型轉換
  const evidenceId = typeof req.query.evidence_id === 'string' ? req.query.evidence_id : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 0;
  const start_date =
    typeof req.query.start_date === 'string' ? parseInt(req.query.start_date) : undefined;
  const end_date =
    typeof req.query.end_date === 'string' ? parseInt(req.query.end_date) : undefined;

  // Info: (20240219 - Julian) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // (20240219 - Julian) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // (20240219 - Julian) 取幾筆

  // Info: (20240219 - Julian) 撈出 transaction data
  const transactionData = evidenceId
    ? await prisma.transactions.findMany({
        where: {
          evidence_id: evidenceId,
          // Info: (20240219 - Julian) 日期區間
          created_timestamp: {
            gte: start_date,
            lte: end_date,
          },
        },
        // Info: (20240219 - Julian) 從新到舊排序
        orderBy: {
          created_timestamp: 'desc',
        },
        // Info: (20240219 - Julian) 分頁
        skip: skip,
        take: take,
        select: {
          chain_id: true,
          hash: true,
          created_timestamp: true,
          from_address: true,
          to_address: true,
          type: true,
          status: true,
        },
      })
    : [];

  // Info: (20240219 - Julian) 從 codes Table 撈出 transaction type 和 status
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

  // Info: (20240219 - Julian) 轉換 type list
  const typeList = transactionCodes.filter(code => code.table_column === 'type');
  // Info: (20240219 - Julian) 轉換 status list
  const statusList = transactionCodes.filter(code => code.table_column === 'status');

  // Info: (20240219 - Julian) 撈出所有 address
  const allAddress = await prisma.addresses.findMany({
    select: {
      address: true,
    },
  });
  const allAddressArray = allAddress.map(address => address.address);

  const result: ResponseData = transactionData.map(transaction => {
    // Info: (20240219 - Julian) from address 轉換
    const fromAddressesRaw = transaction.from_address ? transaction.from_address.split(',') : [];
    // Info: (20240219 - Julian) 如果 address 為 null 就過濾掉
    const fromAddresses = fromAddressesRaw.filter(address => address !== 'null');
    // Info: (20240219 - Julian) 掃描 fromAddresses，如果 `addresses` table 有對應的 address 資料，就輸出 'address'，否則輸出 'evidence'
    const fromType = fromAddresses.map(address => {
      return allAddressArray.includes(address) ? AddressType.ADDRESS : AddressType.CONTRACT;
    });
    const from: IAddressInfo[] = fromAddresses.map((address, index) => {
      return {
        type: fromType[index],
        address: address,
      };
    });

    // Info: (20240219 - Julian) to address 轉換
    const toAddressesRaw = transaction.to_address ? transaction.to_address.split(',') : [];
    // Info: (20240219 - Julian) 如果 address 為 null 就過濾掉
    const toAddresses = toAddressesRaw.filter(address => address !== 'null');
    // Info: (20240219 - Julian) 掃描 toAddresses，如果 `addresses` table 有對應的 address 資料，就輸出 'address'，否則輸出 'evidence'
    const toType = toAddresses.map(address => {
      return allAddressArray.includes(address) ? AddressType.ADDRESS : AddressType.CONTRACT;
    });
    const to: IAddressInfo[] = fromAddresses.map((address, index) => {
      return {
        type: toType[index],
        address: address,
      };
    });

    // Info: (20240219 - Julian) 找出對應的 type 和 status
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

  res.status(200).json(result);
}
