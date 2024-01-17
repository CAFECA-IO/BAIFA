// 009 - GET /app/chains/:chain_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../../../../../../lib/utils/dbConnection';

type Transaction = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  type: string;
  status: string;
};

type ResponseData = Transaction[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  // const start_date =
  //   typeof req.query.start_date === 'string' ? parseInt(req.query.start_date) : undefined;
  // const end_date =
  //   typeof req.query.end_date === 'string' ? parseInt(req.query.end_date) : undefined;
  const addressId = typeof req.query.addressId === 'object' ? req.query.addressId : undefined;

  if (!addressId) {
    // Info: (20240117 - Julian) ========= Transactions of a chain =========
    pool.query(
      `SELECT id,
            hash,
            chain_id as "chainId",
            created_timestamp as "createdTimestamp",
            type,
            status
    FROM transactions
    WHERE chain_id = $1`,
      [chain_id],
      // ToDo: (20240116 - Julian) 這裡要加上條件
      // 1. Filter by chain_id ✅
      // 2. Filter by start_date and end_date
      // 3. Order by newest to oldest
      // 4. pagination
      // AND created_timestamp >= start_date
      // AND created_timestamp <= end_date
      (err: Error, response: any) => {
        if (!err) {
          res.status(200).json(response.rows);
        }
      }
    );
  } else {
    // Info: (20240117 - Julian) ========= Transaction History bewteen two addresses =========
    pool.query(
      `SELECT id,
            hash,
            chain_id as "chainId",
            created_timestamp as "createdTimestamp",
            type,
            status
        FROM transactions
        WHERE from_address
        IN ($1, $2)
        OR to_address
        IN ($1, $2)`,
      // ToDo: (20240117 - Julian) 加上排序條件
      [addressId[0], addressId[1]],
      (err: Error, response: any) => {
        if (!err) {
          res.status(200).json(response.rows);
        }
      }
    );
  }

  /* 
  const result: ResponseData = [
    {
      'id': '930071',
      'chainId': 'isun',
      'createdTimestamp': 1607957394,
      'type': 'Crypto Currency',
      'status': 'SUCCESS',
    },
    {
      'id': '930072',
      'chainId': 'isun',
      'createdTimestamp': 1679978900,
      'type': 'Evidence',
      'status': 'FAILED',
    },
    {
      'id': '930073',
      'chainId': 'usdt',
      'createdTimestamp': 1680176231,
      'type': 'NFT',
      'status': 'PENDING',
    },
  ];

  res.status(200).json(result); */
}
