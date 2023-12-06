/*
022 - Transaction History from Addresses / Transaction List form a block
HTTP Request:
    GET /app/transactions?address=${address1},${address2},...
    GET /app/transactions?block_id=${blockId}
Parameters: address or block_id (Cannot choose both) - required*
Request Example: GET /app/transactions?address=${114007},${110029},...
 */

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  type: 'Crypto Currency' | 'Evidence'; // Update types based on your actual data
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}[];

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
