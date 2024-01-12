// 006 - GET /app/chains/:chain_id/blocks?start_date=${startTimestamp}&end_date=${endTimestamp}

import type {NextApiRequest, NextApiResponse} from 'next';
import client from '../../../../../../../lib/utils/dbConnection';

type BlockData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  stability: 'LOW' | 'MEDIUM' | 'HIGH';
};

type ResponseData = BlockData[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  client.connect();
  client.query(
    `SELECT hash as id,
            chain_id as chainId,
            created_timestamp as createdTimestamp,
            number
      FROM blocks`,
    (err: Error, response: any) => {
      client.end();
      if (!err) {
        res.status(200).json(response.rows);
      }
    }
  );

  /*   const result: ResponseData = [
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

  res.status(200).json(result); */
}
