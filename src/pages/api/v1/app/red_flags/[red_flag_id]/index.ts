// 022 - GET /app/red_flags/:red_flag_id

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../prisma/client';
import {IRedFlagDetail} from '../../../../../../interfaces/red_flag';
// import {AddressType} from '../../../../../../interfaces/address_info';

type ResponseData = IRedFlagDetail;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240131 - Liz) query string parameter
  const red_flag_id =
    typeof req.query.red_flag_id === 'string' ? parseInt(req.query.red_flag_id, 10) : undefined;

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

    const redFlagData = await prisma.red_flags.findUnique({
      where: {
        id: red_flag_id,
      },
      select: {
        id: true,
        chain_id: true,
        red_flag_type: true,
        created_timestamp: true,
        related_addresses: true,
        total_amount: true,
        symbol: true, // unit
        related_transactions: true,
      },
    });

    // Deprecated: (今天丟棄 - Liz)
    // const relatedTransactions = redFlagData?.related_transactions ?? [];
    // // Info: (20240131 - Liz) 透過 redFlagData.related_transactions 從 transactions 表格讀取相關交易資料
    // const transactions = await prisma.transactions.findMany({
    //   where: {
    //     hash: {
    //       in: relatedTransactions,
    //     },
    //   },
    //   select: {
    //     id: true,
    //     chain_id: true,
    //     created_timestamp: true,
    //     from_address: true,
    //     to_address: true,
    //     status: true,
    //     type: true,
    //     hash: true, // transaction hash
    //   },
    // });

    // Info: (20240131 - Liz) 組合回傳資料
    const id = `${redFlagData?.id}`;
    const chainId = `${redFlagData?.chain_id}`;
    const redFlagType = findCodeMeaning(
      'red_flags',
      'red_flag_type',
      `${redFlagData?.red_flag_type}`
    );

    const createdTimestamp = redFlagData?.created_timestamp ?? 0;
    const interactedAddresses =
      redFlagData?.related_addresses.map(address => ({
        id: address,
        chainId: `${redFlagData.chain_id}`,
      })) ?? [];

    const totalAmount = redFlagData?.total_amount ?? '0';

    const unit = redFlagData?.symbol ?? '';

    // Info: (20240131 - Liz) 透過 transactions 資料組合 transactionHistoryData
    // const transactionHistoryData = transactions.map(transaction => {
    //   const from = [
    //     {
    //       address: `${transaction.from_address}`,
    //       type: AddressType.ADDRESS,
    //     },
    //   ];
    //   const to = [
    //     {
    //       address: `${transaction.to_address}`,
    //       type: AddressType.ADDRESS,
    //     },
    //   ];

    //   const status = findCodeMeaning('transactions', 'status', `${transaction.status}`);
    //   const type = findCodeMeaning('transactions', 'type', `${transaction.type}`);

    //   return {
    //     id: `${transaction.hash}`,
    //     chainId: `${transaction.chain_id}`,
    //     createdTimestamp: transaction.created_timestamp ?? 0,
    //     from,
    //     to,
    //     status,
    //     type,
    //   };
    // });

    const result: ResponseData = {
      id,
      chainId,
      redFlagType,
      createdTimestamp,
      interactedAddresses,
      totalAmount,
      unit,
      // transactionHistoryData,
    };

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240314 - Liz) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching red flag detail data (022):', error);
    res.status(500).json({} as ResponseData);
  }
}

/* Mock API */
// export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
//   const result: ResponseData = {
//     'id': '1',
//     'chainId': '8017',
//     'redFlagType': 'Multiple Transfer',
//     'createdTimestamp': 1702615885,
//     'interactedAddresses': [
//       {
//         'id': '0x048adee1b0e93b30f9f7b71f18b963ca9ba5de3b',
//         'chainId': '8017',
//       },
//     ],
//     'totalAmount': '1000',
//     'unit': 'LIZ',
//   };
//   res.status(200).json(result);
// }
