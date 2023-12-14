// 010 - GET /app/chains/:chain_id/transactions/:transaction_id

import type {NextApiRequest, NextApiResponse} from 'next';

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type ResponseData = {
  id: string;
  hash: string;
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING';
  chainId: string;
  chainIcon: string;
  blockId: string;
  createdTimestamp: number;
  from: AddressInfo[];
  to: AddressInfo[];
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
    'from': [{'type': 'address', 'address': '130294'}],
    'to': [{'type': 'contract', 'address': '310071'}],
    'evidenceId': '530029',
    'value': 0.01,
    'fee': 0.01,
    'flaggingType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
  };

  res.status(200).json(result);
}
