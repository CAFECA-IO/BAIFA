// 022 - GET /app/red_flags/:red_flag_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../lib/utils/prismaUtils';
import {ITransaction} from '../../../../../interfaces/transaction';
import {IRedFlagDetail} from '../../../../../interfaces/red_flag';

type ResponseData = IRedFlagDetail | string;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240131 - Liz) 解構 URL 參數，並將字串轉換成數字
  const red_flag_id = parseInt(req.query.red_flag_id as string, 10);

  // Info: (20240131 - Liz) 若 URL 參數沒有成功轉換成數字，回傳 400
  if (Number.isNaN(red_flag_id)) {
    res.status(400).send('400 - typeof red_flag_id must be Number');
    return;
  }

  const codes = await prisma.codes.findMany({
    select: {
      value: true,
      meaning: true,
      table_name: true,
      table_column: true,
    },
  });

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

  // Info: (20240131 - Liz) 若查無資料，回傳 404
  if (redFlagData === null) {
    res.status(404).send('404 - redFlagData Not Found');
    return;
  }

  // Info: (20240131 - Liz) 根據 redFlagData.chain_id 取得 chainName
  const chainNameObj = await prisma.chains.findUnique({
    where: {
      id: redFlagData?.chain_id as unknown as number,
    },
    select: {
      chain_name: true,
    },
  });

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
import {IRedFlagDetail} from '../../../../../interfaces/red_flag';

type ResponseData = IRedFlagDetail | undefined;

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
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
        'type': 'Crypto Currency',
      },
      {
        'id': '912299',
        'chainId': 'btc',
        'createdTimestamp': 1687860718,
        'from': [{'type': 'address', 'address': '110132'}],
        'to': [{'type': 'contract', 'address': '310683'}],
        'status': 'PENDING',
        'type': 'Crypto Currency',
      },
      //...
    ],
  };
  res.status(200).json(result);
  */
}
