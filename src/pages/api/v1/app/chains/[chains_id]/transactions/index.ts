// 009 - GET /app/chains/:chain_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';

type Transaction = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  type: string;
  status: string;
};

type ResponseData = Transaction[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
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

  res.status(200).json(result);
}
