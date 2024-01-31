// 022 - GET /app/red_flags/:red_flag_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../lib/utils/prismaUtils';
import {ITransaction} from '../../../../../interfaces/transaction';
import {IRedFlagDetail} from '../../../../../interfaces/red_flag';

type ResponseData = IRedFlagDetail;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240131 - Liz) 解構 URL 參數，同時進行類型轉換
  const red_flag_id = req.query.red_flag_id as unknown as number;

  // Info: (20240131 - Liz) 若 URL 參數不符合預期，回傳 400
  if (red_flag_id === undefined) {
    return res.status(400);
  }

  const codes = await prisma.codes.findMany({
    select: {
      value: true,
      meaning: true,
      table_name: true,
      table_column: true,
    },
  });

  // // Info: (20240131 - Liz) 取得 red flag type 對照表
  // const codesRedFlagType = await prisma.codes.findMany({
  //   where: {
  //     table_name: 'red_flags',
  //     table_column: 'red_flag_type',
  //   },
  //   select: {
  //     value: true,
  //     meaning: true,
  //   },
  // });

  // // Info: (20240131 - Liz) 取得 transaction status 對照表
  // const codesTransactionStatus = await prisma.codes.findMany({
  //   where: {
  //     table_name: 'transactions',
  //     table_column: 'status',
  //   },
  //   select: {
  //     value: true,
  //     meaning: true,
  //   },
  // });

  // // Info: (20240131 - Liz) 取得 transaction type 對照表
  // const codesTransactionType = await prisma.codes.findMany({
  //   where: {
  //     table_name: 'transactions',
  //     table_column: 'type',
  //   },
  //   select: {
  //     value: true,
  //     meaning: true,
  //   },
  // });

  // Info: (20240131 - Liz) 透過 Prisma 查詢資料庫

  // Deprecated: (丟棄日 - Liz)
  // eslint-disable-next-line no-console
  console.log('TYPE ', typeof red_flag_id);
  // Todo: (20240131 - Liz) 這裡的 red_flag_id 會是 string，但是 Prisma 需要的是 number，所以要轉換

  const redFlagData = await prisma.red_flags.findUnique({
    where: {
      id: red_flag_id as unknown as number,
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

  // Info: (20240131 - Liz) 根據 redFlagData.chain_id 取得 chainName
  const chainNameObj = await prisma.chains.findUnique({
    where: {
      id: redFlagData?.chain_id as unknown as number,
    },
    select: {
      chain_name: true,
    },
  });

  // Info: (20240131 - Liz) 若查無資料，回傳 404
  if (redFlagData === null) {
    return res.status(404);
  }

  // Info: (20240131 - Liz) 透過 redFlagData.related_transactions 從 transactions 表格讀取相關交易
  const transactions = await prisma.transactions.findMany({
    where: {
      hash: {
        in: redFlagData.related_transactions,
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
    },
  });

  // Info: (20240131 - Liz) 組合回傳資料
  const id = redFlagData.id as unknown as string;
  const chainId = redFlagData.chain_id as unknown as string;
  const chainName = chainNameObj?.chain_name as unknown as string;
  const redFlagType = codes.find(
    code =>
      code.table_name === 'red_flags' &&
      code.table_column === 'red_flag_type' &&
      code.value === redFlagData.red_flag_type
  )?.meaning as unknown as IRedFlagDetail['redFlagType'];

  const createdTimestamp = redFlagData.created_timestamp as unknown as number;
  const interactedAddresses = redFlagData.related_addresses.map(address => ({
    id: address as unknown as string,
    chainId: redFlagData.chain_id as unknown as string,
  }));

  const totalAmount = redFlagData.total_amount as unknown as number;
  const unit = redFlagData.symbol as unknown as string;
  const transactionHistoryData = transactions.map(transaction => {
    const from = [
      {
        address: transaction.from_address as unknown as string,
        type: 'address',
      },
    ];
    const to = [
      {
        address: transaction.to_address as unknown as string,
        type: 'address',
      },
    ];

    const status = codes.find(
      code =>
        code.table_name === 'transactions' &&
        code.table_column === 'status' &&
        code.value === transaction.status
    )?.meaning as unknown as ITransaction['status'];

    const type = codes.find(
      code =>
        code.table_name === 'transactions' &&
        code.table_column === 'type' &&
        code.value === transaction.type
    )?.meaning as unknown as ITransaction['type'];

    return {
      id: transaction.id as unknown as string,
      chainId: transaction.chain_id as unknown as string,
      createdTimestamp: transaction.created_timestamp as unknown as number,
      from,
      to,
      status,
      type,
    };
  });

  const result: ResponseData = {
    id,
    chainId,
    chainName,
    redFlagType,
    createdTimestamp,
    interactedAddresses,
    totalAmount,
    unit,
    transactionHistoryData,
  };

  res.status(200).json(result);

  /*
  const result: ResponseData = {
    'id': '140050038',
    'chainId': 'usdt',
    'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW',
    'createdTimestamp': 1686579200,
    'interactedAddresses': [
      {
        'id': '122134',
        'chainId': 'eth',
      },
      {
        'id': '134325',
        'chainId': 'usdt',
      },
    ],
    'totalAmount': 100,
    'unit': 'USDT',
    'transactionHistoryData': [
      {
        'id': '918402',
        'chainId': 'btc',
        'createdTimestamp': 1686579229,
        'from': [{'type': 'address', 'address': '912299'}],
        'to': [{'type': 'contract', 'address': '110132'}],
        'status': 'SUCCESS',
      },
      {
        'id': '912299',
        'chainId': 'btc',
        'createdTimestamp': 1687860718,
        'from': [{'type': 'address', 'address': '110132'}],
        'to': [{'type': 'contract', 'address': '310683'}],
        'status': 'PENDING',
      },
      //...
    ],
  };
  res.status(200).json(result);
  */
}
