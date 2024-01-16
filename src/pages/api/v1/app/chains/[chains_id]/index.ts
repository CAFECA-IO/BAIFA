// 005 - GET /app/chains/:chain_id

import type {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../../../../../lib/utils/dbConnection';

type ResponseData = {
  chainId: string;
  chainName: string;
  chainIcon: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  pool.query(
    `SELECT id as "chainId", 
            chain_name as "chainName",
            chain_icon as "chainIcon"
     FROM chains
     WHERE id = $1`,
    [8017], // ToDo: (20240116 - Julian) 暫時先寫死，之後再補上 req.query.chains_id
    (err: Error, response: any) => {
      if (!err) {
        res.status(200).json(response.rows[0]);
      }
    }
  );

  // pool.query(
  //   `SELECT id as "chainId",
  //           chain_name as "chainName",
  //           chain_icon as "chainIcon"
  //    FROM chains
  //     WHERE id = $1`,
  //   [8017], // ToDo: (20240116 - Julian) 暫時先寫死，之後再補上 req.query.chains_id
  //   (err: Error, response: any) => {
  //     client.end();
  //     if (!err) {
  //       res.status(200).json(response.rows);
  //     }
  //   }
  // );

  /*   const result: ResponseData = {
    'chainId': 'isun',
    'chainName': 'iSunCloud',
    'chainIcon': '/currencies/isun.svg',
  };

  res.status(200).json(result); */
}
