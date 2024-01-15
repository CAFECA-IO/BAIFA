// 006 - GET /app/chains/:chain_id/blocks?start_date=${startTimestamp}&end_date=${endTimestamp}

import type {NextApiRequest, NextApiResponse} from 'next';
//import client from '../../../../../../../lib/utils/dbConnection';

type BlockData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  stability: 'LOW' | 'MEDIUM' | 'HIGH';
};

type ResponseData = BlockData[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  // const chain_id = typeof req.query.chains_id === 'string' ? req.query.chains_id : undefined;
  // const start_date =
  //   typeof req.query.start_date === 'string' ? parseInt(req.query.start_date) : undefined;
  // const end_date =
  //   typeof req.query.end_date === 'string' ? parseInt(req.query.end_date) : undefined;

  // client.connect();
  // client.query(
  //   `SELECT hash as "id",
  //           chain_id as "chainId",
  //           created_timestamp as "createdTimestamp",
  //           number
  //     FROM blocks
  //     `,
  //   // ToDo: (20240112 - Julian) 這裡要加上條件
  //   // 1. Filter by chain_id
  //   // 2. Filter by start_date and end_date
  //   // 3. Order by newest to oldest
  //   // 4. pagination
  //   // WHERE chain_id = 8017
  //   // AND created_timestamp >= start_date
  //   // AND created_timestamp <= end_date
  //   (err: Error, response: any) => {
  //     client.end();
  //     if (!err) {
  //       res.status(200).json(response.rows);
  //     }
  //   }
  // );

  const result: ResponseData = [
    {
      'id': '230020',
      'chainId': 'isun',
      'createdTimestamp': 1673940795,
      'stability': 'MEDIUM',
    },
    {
      'id': '230021',
      'chainId': 'isun',
      'createdTimestamp': 1679978900,
      'stability': 'HIGH',
    },
    {
      'id': '230022',
      'chainId': 'isun',
      'createdTimestamp': 1680176231,
      'stability': 'LOW',
    },
  ];

  res.status(200).json(result);
}
