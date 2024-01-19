// 008 - GET /app/chains/:chain_id/blocks/:block_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  type: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
};

type ResponseData = TransactionData[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240116 - Julian) 解構 URL 參數，同時進行類型轉換
  const block_id =
    typeof req.query.block_id === 'string' ? parseInt(req.query.block_id) : undefined;

  // Info: (20240119 - Julian) 從 blocks Table 撈出 block_id 對應的 blockhash
  const blockHash = await prisma.blocks.findUnique({
    where: {
      id: block_id,
    },
    select: {
      hash: true,
    },
  });

  // Info: (20240119 - Julian) 再從 transactions 撈出位於 block_id 下的所有 transaction 的資料
  const transactions = await prisma.transactions.findMany({
    where: {
      block_hash: blockHash?.hash,
    },
    select: {
      id: true,
      chain_id: true,
      created_timestamp: true,
      type: true,
      status: true,
    },
  });

  // Info: (20240118 - Julian) 轉換成 API 要的格式
  const result: ResponseData = transactions.map(transaction => {
    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transaction.created_timestamp.getTime() / 1000,
      type: transaction.type, // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 type 的轉換
      status: 'SUCCESS', // ToDo: (20240118 - Julian) 需要參考 codes Table 並補上 status 的轉換
    };
  });

  res.status(200).json(result);

  /*   
  const result: ResponseData = [
    {
      'id': '916841',
      'chainId': 'btc',
      'createdTimestamp': 1678057313,
      'type': 'Crypto Currency',
      'status': 'SUCCESS',
    },
    {
      'id': '910237',
      'chainId': 'btc',
      'createdTimestamp': 1681731057,
      'type': 'Evidence',
      'status': 'SUCCESS',
    },
    {
      'id': '910237',
      'chainId': 'btc',
      'createdTimestamp': 1683905718,
      'type': 'Crypto Currency',
      'status': 'SUCCESS',
    },
    {
      'id': '919472',
      'chainId': 'btc',
      'createdTimestamp': 1689732890,
      'type': 'Evidence',
      'status': 'FAILED',
    },
    {
      'id': '911837',
      'chainId': 'btc',
      'createdTimestamp': 1690209183,
      'type': 'Crypto Currency',
      'status': 'PENDING',
    },
    // ...other transactions
  ];

  res.status(200).json(result); */
}
