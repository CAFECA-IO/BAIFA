// /app/chains/:chainId/addresses/:addressId

import type {NextApiRequest, NextApiResponse} from 'next';

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
  createdTimestamp: number;
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type BlockProducedData = {
  id: string;
  createdTimestamp: number;
  stability: 'LOW' | 'MEDIUM' | 'HIGH';
};

type ResponseData = {
  id: string;
  type: 'address';
  address: string;
  chainId: string;
  chainIcon: string;
  createdTimestamp: number;
  latestActiveTime: number;
  relatedAddressIds: string[];
  interactedAddressCount: number;
  interactedContactCount: number;
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
    'relatedAddressIds': ['110029', '112840', '114007'],
    'interactedAddressCount': 3,
    'interactedContactCount': 2,
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
        'id': '930154',
        'createdTimestamp': 1679978987,
        'type': 'Crypto Currency',
        'status': 'SUCCESS',
      },
      {
        'id': '930785',
        'createdTimestamp': 1687909392,
        'type': 'Evidence',
        'status': 'FAILED',
      },
      //...
    ],
    'blockProducedData': [
      {
        'id': '230976',
        'createdTimestamp': 1678940724,
        'stability': 'MEDIUM',
      },
      {
        'id': '234680',
        'createdTimestamp': 1684176283,
        'stability': 'LOW',
      },
      //...
    ],
    'flaggingCount': 23,
    'riskLevel': 'MEDIUM_RISK',
    'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
  };

  res.status(200).json(result);
}
