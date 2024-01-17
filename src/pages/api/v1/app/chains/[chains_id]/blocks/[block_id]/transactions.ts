// 008 - GET /app/chains/:chain_id/blocks/:block_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../../../../../../../lib/utils/dbConnection';

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  type: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
};

type ResponseData = TransactionData[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240116 - Julian) 解構 URL 參數，同時進行類型轉換
  const block_id = typeof req.query.block_id === 'string' ? req.query.block_id : undefined;

  pool.query(
    `SELECT id,
            chain_id as "chainId",
            created_timestamp as "createdTimestamp",
            type,
            status
      FROM transactions
    WHERE block_hash = $1`,
    [block_id],
    (err: Error, response: any) => {
      if (!err) {
        res.status(200).json(response.rows[0]);
      }
    }
  );

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
