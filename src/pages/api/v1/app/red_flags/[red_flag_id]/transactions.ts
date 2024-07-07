// 035 - GET /app/red_flags/:red_flag_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {DEFAULT_PAGE, ITEM_PER_PAGE} from '@/constants/config';
import {ITransactionHistorySection} from '@/interfaces/transaction';
import {AddressType} from '@/interfaces/address_info';
import prisma from '@/lib/utils/prisma'

type ResponseData = ITransactionHistorySection;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240320 - Liz) query string parameter
  const red_flag_id =
    typeof req.query.red_flag_id === 'string' ? parseInt(req.query.red_flag_id, 10) : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : DEFAULT_PAGE;
  const offset =
    typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : ITEM_PER_PAGE;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : undefined;

  // Info: (20240320 - Liz) 將 req 傳來的日期字串轉換成數字或 undefined
  const parseDate = (dateString: string | string[] | undefined) => {
    if (typeof dateString === 'string') {
      const parsedDate = parseInt(dateString, 10);
      return !isNaN(parsedDate) && parsedDate > 0 ? parsedDate : undefined;
    }
    return undefined;
  };
  const startDate = parseDate(req.query.start_date);
  const endDate = parseDate(req.query.end_date);

  // Info: (20240319 - Liz) 計算分頁的 skip 與 take
  const skip = page > 0 ? (page - 1) * offset : 0; // Info: (20240319 - Liz) 跳過前面幾筆
  const take = offset; // Info: (20240319 - Liz) 取幾筆

  try {
    // Info: (20240131 - Liz) 從 codes table 中取得所有 code 資料
    const codes = await prisma.codes.findMany({
      select: {
        value: true,
        meaning: true,
        table_name: true,
        table_column: true,
      },
    });

    // Info: (20240223 - Liz)  將 codes 預處理成物件以便有效率查找
    const codeMap: {[key: string]: string | null} = {};
    codes.forEach(code => {
      const key = `${code.table_name}-${code.table_column}-${code.value}`;
      codeMap[key] = code.meaning;
    });

    // Info: (20240223 - Liz)  定義一個幫助函數來查找 code 的意義
    const findCodeMeaning = (tableName: string, tableColumn: string, value: string) => {
      const key = `${tableName}-${tableColumn}-${value}`;
      return codeMap[key] ?? 'Unknown Meaning';
    };

    // Info: (20240320 - Liz) 從 red_flags Table 中取得 related_transactions
    const redFlagData = await prisma.red_flags.findUnique({
      where: {
        id: red_flag_id,
      },
      select: {
        related_transactions: true,
      },
    });

    const relatedTransactions = redFlagData?.related_transactions ?? [];

    // Info: (20240320 - Liz) 從 transactions Table 中取得 transactions
    const transactions = await prisma.transactions.findMany({
      where: {
        hash: {
          in: relatedTransactions,
          equals: search ? search : undefined,
        },
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
        status: true,
        type: true,
        hash: true, // transaction hash
      },
      orderBy: [
        {
          created_timestamp: sort,
        },
        {
          id: sort,
        },
      ],
      // Info: (20240320 - Liz) 分頁
      skip: search ? 0 : skip, // Info: (20240320 - Liz) search 有值時最多只會搜尋到一筆，故不需要分頁
      take,
    });

    // Info: (20240320 - Liz) 取得 交易 總筆數
    const transactionCount = await prisma.transactions.count({
      where: {
        hash: {
          in: relatedTransactions,
          equals: search ? search : undefined,
        },
        created_timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Info: (20240320 - Liz) 計算總頁數
    const totalPages = Math.ceil(transactionCount / offset);

    // Info: (20240131 - Liz) 透過 transactions 資料組合 transactionHistoryData
    const transactionHistoryData = transactions.map(transaction => {
      const from = [
        {
          address: `${transaction.from_address}`,
          type: AddressType.ADDRESS,
        },
      ];
      const to = [
        {
          address: `${transaction.to_address}`,
          type: AddressType.ADDRESS,
        },
      ];

      const status = findCodeMeaning('transactions', 'status', `${transaction.status}`);
      const type = findCodeMeaning('transactions', 'type', `${transaction.type}`);

      return {
        id: `${transaction.hash}`,
        chainId: `${transaction.chain_id}`,
        createdTimestamp: transaction.created_timestamp ?? 0,
        from,
        to,
        status,
        type,
      };
    });

    const result = {
      transactions: transactionHistoryData,
      totalPages,
      transactionCount,
    };

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240320 - Liz)  Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching transaction list of a red flag (035):', error);
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
//             'address': '0x048adee1b0e93b30f9f7b71f18b963ca9ba5de3b',
//             'type': 'address',
//           },
//         ],
//         'to': [
//           {
//             'address': '0x87b966e36cc1f3a2b855ffff904f6f6acaaec1db',
//             'type': 'address',
//           },
//         ],
//         'status': 'Success',
//         'type': 'Normal',
//       },
//     ],
//     'totalPages': 10,
//     'transactionCount': 100,
//   };
//   return res.status(200).json(result);
// }
