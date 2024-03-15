// 030 - GET /app/currencies/:currency_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../prisma/client';
import {ITransaction, ITransactionList} from '../../../../../../interfaces/transaction';
import {AddressType, IAddressInfo} from '../../../../../../interfaces/address_info';
import {ITEM_PER_PAGE} from '../../../../../../constants/config';

type ResponseData = ITransactionList;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (今天 - Liz) query string parameter
  const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : undefined;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : undefined;

  // Info: (20240307 - Liz) 將 req 傳來的日期字串轉換成數字或 undefined
  const parseDate = (dateString: string | string[] | undefined) => {
    if (typeof dateString === 'string') {
      const parsedDate = parseInt(dateString, 10);
      return !isNaN(parsedDate) && parsedDate > 0 ? parsedDate : undefined;
    }
    return undefined;
  };
  const startDate = parseDate(req.query.start_date);
  const endDate = parseDate(req.query.end_date);

  // Info: (今天 - Liz) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // Info: (20240306 - Liz) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // Info: (20240306 - Liz) 取幾筆

  // Info: (今天 - Liz) 排序
  const sorting = sort === 'SORTING.OLDEST' ? 'asc' : 'desc';

  try {
    // Info: (今天 - Liz) 從 currencies Table 中取得 chainId
    const currencyData = await prisma.currencies.findUnique({
      where: {
        id: currency_id,
      },
      select: {
        chain_id: true,
      },
    });
    const chainId = currencyData?.chain_id;

    // Info: (今天 - Liz) 從 token_transfers Table 中取得 transactionHistoryData
    const transactionData = await prisma.token_transfers.findMany({
      where: {
        chain_id: chainId,
        // Info: (今天 - Liz) 交易 hash 搜尋條件篩選, '' or undefined 代表忽略搜尋條件
        transaction_hash: search ? search : undefined,
        created_timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        from_address: true,
        to_address: true,
        transaction_hash: true,
      },
      orderBy: [
        {
          created_timestamp: sorting, // ToDo: (今天 - Liz) 1. created_timestamp 由 sorting 決定排序
        },
        {
          id: sorting, // ToDo: (今天 - Liz) 2. id 由 sorting 決定排序
        },
      ],
      skip: search ? 0 : skip, // Info: (今天 - Liz) search 有值時最多只會搜尋到一筆，故不需要分頁
      take,
    });

    // Info: (今天 - Liz) 取得 交易 總筆數
    const transactionCount = await prisma.token_transfers.count({
      where: {
        chain_id: chainId,
      },
    });

    // Info: (今天 - Liz) 計算總頁數
    const totalPages = Math.ceil(transactionCount / ITEM_PER_PAGE);

    // Info: (20240221 - Liz) 從 transactions Table 撈出 transaction_hash 和 status 組合成一個物件陣列
    const transactionHashStatusArr = await prisma.transactions.findMany({
      select: {
        hash: true,
        status: true,
      },
    });

    // Info: (20240222 - Liz) 將 transaction_hash 和 status 組合的物件陣列遍歷為一個物件
    const transactionHashStatusObj: {
      [key: string]: string;
    } = {};
    transactionHashStatusArr.forEach(item => {
      if (item.hash !== null) {
        transactionHashStatusObj[item.hash] = item.status as string;
      }
    });

    // Info: (20240222 - Liz) 從 codes Table 撈出 status 的 value 和 meaning 的對照表為一個物件陣列
    const statusCodes = await prisma.codes.findMany({
      where: {
        table_name: 'transactions',
        table_column: 'status',
      },
      select: {
        value: true,
        meaning: true,
      },
    });

    // Info: (20240222 - Liz) 遍歷物件陣列 轉換成物件
    const statusCodesObj: {
      [key: string]: string;
    } = {};
    statusCodes.forEach(item => {
      if (item.value !== null) {
        statusCodesObj[item.value] = item.meaning as string;
      }
    });

    // Info: (20240226 - Liz) 將 transactionData 轉換成 transactionHistoryData
    const transactionHistoryData: ITransaction[] = transactionData.map(transaction => {
      // Info: (20240130 - Julian) from address 轉換
      const fromAddresses = transaction.from_address ? transaction.from_address.split(',') : [];

      const from: IAddressInfo[] = fromAddresses
        .filter(address => address !== 'null') // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
        .map(address => {
          return {
            type: AddressType.ADDRESS, // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
            address: address,
          };
        });

      // Info: (20240130 - Julian) to address 轉換
      const toAddresses = transaction.to_address ? transaction.to_address.split(',') : [];

      const to: IAddressInfo[] = toAddresses
        // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
        .filter(address => address !== 'null')
        .map(address => {
          return {
            type: AddressType.ADDRESS, // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
            address: address,
          };
        });

      // Info: (20240222 - Liz) 得到該筆交易 hash 所對應的 status
      const statusStr = transaction.transaction_hash
        ? transactionHashStatusObj[transaction.transaction_hash]
        : 'Unknown Status';

      // Info: (20240221 - Liz) 再將 status 轉換成對應的 meaning
      const status = statusCodesObj[statusStr] ?? 'Unknown Status';

      return {
        id: `${transaction.transaction_hash}`,
        chainId: `${transaction.chain_id}`,
        createdTimestamp: transaction.created_timestamp ?? 0,
        from: from,
        to: to,
        type: 'Crypto Currency', // ToDo: (20240131 - Julian) 畫面需要調整，此欄位可能刪除
        status: status, // ToDo: (20240131 - Julian) 畫面需要調整，此欄位可能刪除
      };
    });

    // Info: (今天 - Liz)
    const result = {
      'transactions': transactionHistoryData,
      'totalPages': totalPages,
    };

    return res.status(200).json(result);
  } catch (error) {
    // Info: (20240312 - Liz) Request error
    // eslint-disable-next-line no-console
    console.error('Error in fetching transaction data (030):', error);
    res.status(500).json({} as ResponseData);
  }
}

/* ---------- Mock API ---------- */
// export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
//   const result = {
//     'transactions': [
//       {
//         'id': '0x4507de0220ac5aaba6502acaadfaf8eade04a7900188de50e75bd7e894d69596',
//         'chainId': '8017',
//         'createdTimestamp': 1702615885,
//         'from': [
//           {
//             'type': 'address',
//             'address': '0x048adee1b0e93b30f9f7b71f18b963ca9ba5de3b',
//           },
//         ],
//         'to': [
//           {
//             'type': 'address',
//             'address': '0x87b966e36cc1f3a2b855ffff904f6f6acaaec1db',
//           },
//         ],
//         'type': 'Crypto Currency',
//         'status': 'Success',
//       },
//       // ... other transactions
//     ],
//     'totalPages': 10,
//   };
//   return res.status(200).json(result);
// }
