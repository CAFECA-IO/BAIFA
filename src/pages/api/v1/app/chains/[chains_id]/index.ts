// 005 - GET /app/chains/:chain_id

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  chainId: string;
  chainName: string;
  chainIcon: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'chainId': 'isun',
    'chainName': 'iSunCloud',
    'chainIcon': '/currencies/isun.svg',
  };

  res.status(200).json(result);
}
