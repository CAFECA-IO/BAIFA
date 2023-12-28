// 014 - GET /app/chains/:chain_id/addresses/:address_id/interactions?type=address

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  id: string;
  type: 'address' | 'contract';
  chainId: string;
  chainIcon: string;
  publicTag: string[];
  createdTimestamp: number;
  transactionCount: number;
}[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = [
    {
      'id': '122134',
      'type': 'address',
      'chainId': 'eth',
      'chainIcon': '/currencies/eth.svg',
      'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
      'createdTimestamp': 167823123,
      'transactionCount': 2,
    },
    {
      'id': '129381',
      'type': 'address',
      'chainId': 'eth',
      'chainIcon': '/currencies/eth.svg',
      'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
      'createdTimestamp': 167538231,
      'transactionCount': 3,
    },
    {
      'id': '322738',
      'type': 'contract',
      'chainId': 'eth',
      'chainIcon': '/currencies/eth.svg',
      'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
      'createdTimestamp': 1678273194,
      'transactionCount': 2,
    },
    {
      'id': '324472',
      'type': 'contract',
      'chainId': 'eth',
      'chainIcon': '/currencies/eth.svg',
      'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
      'createdTimestamp': 1681310427,
      'transactionCount': 1,
    },
    //...
  ];

  res.status(200).json(result);
}
