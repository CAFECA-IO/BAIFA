// /app/chains/:chainId/addresses/:addressId/red-flags

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  id: string;
  chainId: string;
  chainIcon: string;
  addressId: string;
  redFlagType: string;
  createdTimestamp: number;
}[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = [
    {
      'id': '1300200001',
      'chainId': 'isun',
      'chainIcon': '/currencies/isun.svg',
      'addressId': '130020',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW',
      'createdTimestamp': 1679978900,
    },
    {
      'id': '1300200002',
      'chainId': 'isun',
      'chainIcon': '/currencies/isun.svg',
      'addressId': '130020',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
      'createdTimestamp': 1680183194,
    },
    {
      'id': '1300200003',
      'chainId': 'isun',
      'chainIcon': '/currencies/isun.svg',
      'addressId': '130020',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
      'createdTimestamp': 1682194724,
    },
    {
      'id': '1300200004',
      'chainId': 'isun',
      'chainIcon': '/currencies/isun.svg',
      'addressId': '130020',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
      'createdTimestamp': 1682729103,
    },
    // ... other red flags
  ];
  res.status(200).json(result);
}
