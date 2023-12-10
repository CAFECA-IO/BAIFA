// 001 - GET /app

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  chains: number;
  cryptoCurrencies: number;
  blackList: number;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'chains': 5,
    'cryptoCurrencies': 5,
    'blackList': 7,
  };
  res.status(200).json(result);
}
