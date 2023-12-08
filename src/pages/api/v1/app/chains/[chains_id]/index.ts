// 005 - GET /app/chains/:chain_id

import type {NextApiRequest, NextApiResponse} from 'next';

type BlockData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  stability: 'LOW' | 'MEDIUM' | 'HIGH';
};

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type ResponseData = {
  chainId: string;
  chainName: string;
  chainIcon: string;
  blockData: BlockData[];
  transactionData: TransactionData[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'chainId': 'isun',
    'chainName': 'iSunCloud',
    'chainIcon': '/currencies/isun.svg',
    'blockData': [
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
      //...
    ],
    'transactionData': [
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
      //...
    ],
  };

  res.status(200).json(result);
}
