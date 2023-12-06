// /app/blacklist

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  id: string;
  chainId: string;
  latestActiveTime: number;
  flaggingRecords: string[];
  publicTag: string[];
}[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = [
    {
      'id': '120008',
      'chainId': 'eth',
      'latestActiveTime': 1686710310,
      'flaggingRecords': ['RED_FLAG_DETAIL_PAGE.FLAG_TYPE_HIGH_RISK_LOCATION'],
      'publicTag': ['PUBLIC_TAG.HACKER'],
    },
    {
      'id': '143281',
      'chainId': 'usdt',
      'latestActiveTime': 1690283421,
      'flaggingRecords': [
        'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
        'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW',
      ],
      'publicTag': ['PUBLIC_TAG.HACKER'],
    },
    {
      'id': '117263',
      'chainId': 'btc',
      'latestActiveTime': 1682740134,
      'flaggingRecords': [
        'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_TRANSFER',
        'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
      ],
      'publicTag': ['PUBLIC_TAG.HACKER'],
    },
    // ...other blacklisted addresses
  ];

  res.status(200).json(result);
}
