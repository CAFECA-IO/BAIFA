// 001 - GET /app

import type {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../../../lib/utils/dbConnection';

type ResponseData = {
  chains: number;
  cryptoCurrencies: number;
  blackList: number;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  let chains = 0;
  let cryptoCurrencies = 0;
  let blackList = 0;

  // Info: (20240117 - Julian) 定義一個函數來執行查詢
  const runQuery = (query: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      pool.query(query, (err: Error, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.rows.length);
        }
      });
    });
  };

  // Info: (20240117 - Julian) 使用 Promise.all 來等待所有查詢完成
  Promise.all([
    runQuery('SELECT * FROM chains'),
    runQuery('SELECT * FROM currencies'),
    runQuery('SELECT * FROM black_lists'),
  ])
    .then((results: number[]) => {
      chains = results[0];
      cryptoCurrencies = results[1];
      blackList = results[2];

      res.status(200).json({chains, cryptoCurrencies, blackList});
    })
    .catch(error => {
      res.status(500).json(error);
    });

  /* 
  const result: ResponseData = {
    'chains': 5,
    'cryptoCurrencies': 5,
    'blackList': 7,
  };
  res.status(200).json(result); */
}
