// 010 - GET /app/chains/:chainId/transactions/:transactionId

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  id: string;
  hash: string;
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING';
  chainId: string;
  chainIcon: string;
  blockId: string;
  createdTimestamp: number;
  fromAddressId: string;
  toAddressId: string;
  evidenceId: string;
  value: number;
  fee: number;
  flaggingType: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES';
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'id': '930071',
    'hash': '0xE47Dcf8aF9829AD3c4E31409eB6ECfecd046d1BD',
    'type': 'NFT',
    'status': 'PROCESSING',
    'chainId': 'isun',
    'chainIcon': '/currencies/isun.svg',
    'blockId': '230021',
    'createdTimestamp': 1688342795,
    'fromAddressId': '130008',
    'toAddressId': '310029',
    'evidenceId': '530029',
    'value': 0.01,
    'fee': 0.01,
    'flaggingType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
  };

  res.status(200).json(result);
}
