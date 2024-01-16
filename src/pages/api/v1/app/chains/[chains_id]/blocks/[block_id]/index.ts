// 007 - GET /app/chains/:chain_id/blocks/:block_id

import type {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../../../../../../../lib/utils/dbConnection';

type ResponseData = {
  id: string;
  chainId: string;
  chainIcon: string;
  stability: 'MEDIUM' | 'HIGH' | 'LOW';
  createdTimestamp: number;
  managementTeam: string[];
  transactionCount: number;
  miner: string;
  reward: number;
  unit: string;
  size: number; // bytes
  previousBlockId: string;
  nextBlockId: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Info: (20240116 - Julian) 解構 URL 參數，同時進行類型轉換
  const block_id = typeof req.query.block_id === 'string' ? req.query.block_id : undefined;

  pool.query(
    `SELECT id,
            chain_id as "chainId",
            created_timestamp as "createdTimestamp",
            transaction_count as "transactionCount",
            miner,
            reward,
            size
    FROM blocks
    WHERE id = $1`,
    [block_id],
    // ToDo: (20240116 - Julian) 補上欄位
    // 1. chainIcon
    // 2. stability
    // 3. managementTeam
    // 4. unit
    // 5. previousBlockId
    // 6. nextBlockId
    (err: Error, response: any) => {
      if (!err) {
        res.status(200).json(response.rows[0]);
      }
    }
  );

  /*   
  const result: ResponseData = {
    'id': '230021',
    'chainId': 'isun',
    'chainIcon': '/currencies/isun.svg',
    'stability': 'HIGH', //"MEDIUM" | "HIGH" | "LOW"
    'createdTimestamp': 1679978900,
    'managementTeam': ['Alice', 'Bob', 'Charlie'],
    'transactionCount': 25,
    'miner': '0x1234567890',
    'reward': 2.5,
    'unit': 'isun',
    'size': 3523, //bytes
    'previousBlockId': '230020',
    'nextBlockId': '230022',
  };

  res.status(200).json(result); */
}
