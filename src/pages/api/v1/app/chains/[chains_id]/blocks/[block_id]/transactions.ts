// 008 - GET /app/chains/:chain_id/blocks/:block_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  type: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
};

type ResponseData = TransactionData[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
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

  res.status(200).json(result);
}
