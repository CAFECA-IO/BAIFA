// 019 - GET /app/currencies/:currency_id/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  id: string;
  chainId: string;
  addressId: string;
  redFlagType: string;
  createdTimestamp: number;
}[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = [
    {
      'id': '1183720028',
      'chainId': 'btc',
      'addressId': '118372',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
      'createdTimestamp': 1679099781,
    },
    {
      'id': '1132480029',
      'chainId': 'btc',
      'addressId': '113248',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
      'createdTimestamp': 1682172429,
    },
    {
      'id': '1182740004',
      'chainId': 'btc',
      'addressId': '118274',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_BLACK_LIST',
      'createdTimestamp': 1689427103,
    },
    {
      'id': '1192830192',
      'chainId': 'btc',
      'addressId': '119283',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MIXING_SERVICE',
      'createdTimestamp': 1689424291,
    },
    // ... other red flags
  ];

  res.status(200).json(result);
}
