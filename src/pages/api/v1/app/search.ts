// /app/search?search_input=${searchInput}

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  type: string;
  data: {
    id: string;
    chainId: string;
    createdTimestamp: number;
    stability?: string;
    address?: string;
    flaggingCount?: number;
    riskLevel?: string;
    contractAddress?: string;
    evidenceAddress?: string;
    hash?: string;
    publicTag?: string[];
    redFlagType?: string;
  };
}[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = [
    {
      'type': 'BLOCK',
      'data': {
        'id': '210018',
        'chainId': 'btc',
        'createdTimestamp': 1665798400,
        'stability': 'MEDIUM',
      },
    },
    {
      'type': 'ADDRESS',
      'data': {
        'id': '148208',
        'chainId': 'usdt',
        'createdTimestamp': 1682940241,
        'address': '0x278432201',
        'flaggingCount': 10,
        'riskLevel': 'MEDIUM_RISK',
      },
    },
    {
      'type': 'CONTRACT',
      'data': {
        'id': '314839',
        'chainId': 'btc',
        'createdTimestamp': 1681918401,
        'contractAddress': '0x444357813',
      },
    },
    {
      'type': 'EVIDENCE',
      'data': {
        'id': '528401',
        'chainId': 'eth',
        'createdTimestamp': 1680421348,
        'evidenceAddress': '0x898765432',
      },
    },
    {
      'type': 'TRANSACTION',
      'data': {
        'id': '924044',
        'chainId': 'eth',
        'createdTimestamp': 1684482143,
        'hash': '0x213456789',
      },
    },
    {
      'type': 'BLACKLIST',
      'data': {
        'id': '142523',
        'chainId': 'usdt',
        'createdTimestamp': 1684801889,
        'address': '0x270183713',
        'publicTag': ['PUBLIC_TAG.HACKER'],
      },
    },
    {
      'type': 'RED_FLAG',
      'data': {
        'id': '1138290086',
        'chainId': 'btc',
        'createdTimestamp': 1689244021,
        'address': '0x383488493',
        'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
      },
    },
    // ... other result
  ];

  res.status(200).json(result);
}
