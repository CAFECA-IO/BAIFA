// 007 - GET /app/chains/:chain_id/blocks/:block_id

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  id: string;
  chainId: string;
  chainIcon: string;
  stability: 'MEDIUM' | 'HIGH' | 'LOW';
  createdTimestamp: number;
  managementTeam: string[];
  transactionCount: number;
  miner: string;
  reward: number;
  size: number; // bytes
  previousBlockId: string;
  nextBlockId: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const result: ResponseData = {
    'id': '230021',
    'chainId': 'isun',
    'chainIcon': '/currencies/isun.svg',
    'stability': 'HIGH', //"MEDIUM" | "HIGH" | "LOW"
    'createdTimestamp': 1679978900,
    'managementTeam': ['Alice', 'Bob', 'Charlie'],
    'transactionCount': 25,
    'miner': '0x1234567890',
    'reward': 2.5,
    'size': 3523, //bytes
    'previousBlockId': '230020',
    'nextBlockId': '230022',
  };

  res.status(200).json(result);
}
