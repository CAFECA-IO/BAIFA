// 021 - GET /app/red_flags

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
      'id': '1223724980',
      'chainId': 'eth',
      'addressId': '122372',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_TRANSFER',
      'createdTimestamp': 1677769870,
    },
    {
      'id': '1132480029',
      'chainId': 'btc',
      'addressId': '113248',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
      'createdTimestamp': 1682172429,
    },
    {
      'id': '1468697785',
      'chainId': 'usdt',
      'addressId': '146869',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_GAMBLING_SITE',
      'createdTimestamp': 1686548904,
    },
    {
      'id': '1378976701',
      'chainId': 'isun',
      'addressId': '137897',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_DEPOSIT',
      'createdTimestamp': 1690657412,
    },
    // ... other red flags
  ];
  res.status(200).json(result);
}
