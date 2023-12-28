// 011 - GET /app/chains/:chain_id/addresses/:address_id

import type {NextApiRequest, NextApiResponse} from 'next';

type RelatedAddressInfo = {
  id: string;
  chainId: string;
};

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type ReviewData = {
  id: string;
  transactionId: string;
  chainId: string;
  createdTimestamp: number;
  authorAddressId: string;
  content: string;
  stars: number;
};

type TransactionHistoryData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  from: AddressInfo[];
  to: AddressInfo[];
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type BlockProducedData = {
  id: string;
  createdTimestamp: number;
  stability: 'LOW' | 'MEDIUM' | 'HIGH';
  reward: number;
  unit: string;
  chainIcon: string;
};

type ResponseData = {
  id: string;
  type: string;
  address: string;
  chainId: string;
  chainIcon: string;
  createdTimestamp: number;
  latestActiveTime: number;
  relatedAddresses: RelatedAddressInfo[];
  interactedAddressCount: number;
  interactedContactCount: number;
  score: number;
  reviewData: ReviewData[];
  transactionHistoryData: TransactionHistoryData[];
  blockProducedData: BlockProducedData[];
  flaggingCount: number;
  riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
  publicTag: string[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'id': '110132',
    'type': 'address',
    'address': '0x2775D3190693fEc256d156f9f74Cd8843A79',
    'chainId': 'btc',
    'chainIcon': '/currencies/isun.svg',
    'createdTimestamp': 1680827461,
    'latestActiveTime': 1682935384,
    'relatedAddresses': [
      {
        'id': '214134',
        'chainId': 'btc',
      },
      {
        'id': '234143',
        'chainId': 'eth',
      },
      // ...
    ],
    'interactedAddressCount': 3,
    'interactedContactCount': 2,
    'score': 2.8,
    'reviewData': [
      {
        'id': 'T93015400001',
        'transactionId': '930154',
        'chainId': 'btc',
        'createdTimestamp': 1689352795,
        'authorAddressId': '324801',
        'content': 'This is a review',
        'stars': 3,
      },
      {
        'id': 'T93015400002',
        'transactionId': '930154',
        'chainId': 'btc',
        'createdTimestamp': 1689752690,
        'authorAddressId': '327923',
        'content': 'This is a review',
        'stars': 3,
      },
      //...
    ],
    'transactionHistoryData': [
      {
        'id': '918402',
        'chainId': 'btc',
        'createdTimestamp': 1679978987,
        'from': [{'type': 'address', 'address': '114007'}], // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        'to': [{'type': 'contract', 'address': '110132'}],
        'type': 'Evidence',
        'status': 'SUCCESS',
      },
      {
        'id': '912299',
        'chainId': 'btc',
        'createdTimestamp': 1687909392,
        'from': [{'type': 'address', 'address': '110132'}], // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        'to': [{'type': 'contract', 'address': '310683'}],
        'type': 'Evidence',
        'status': 'FAILED',
      },
      //...
    ],
    'blockProducedData': [
      {
        'id': '217328',
        'createdTimestamp': 1678940724,
        'stability': 'MEDIUM',
        'reward': 2.4,
        'unit': 'btc',
        'chainIcon': '/currencies/btc.svg',
      },
      {
        'id': '217329',
        'createdTimestamp': 1684176283,
        'stability': 'LOW',
        'reward': 2.4,
        'unit': 'btc',
        'chainIcon': '/currencies/btc.svg',
      },
      //...
    ],
    'flaggingCount': 23,
    'riskLevel': 'MEDIUM_RISK',
    'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
  };

  res.status(200).json(result);
}
