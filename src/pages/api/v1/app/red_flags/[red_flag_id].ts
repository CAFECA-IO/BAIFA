// 022 - GET /app/red_flags/:red_flag_id

import type {NextApiRequest, NextApiResponse} from 'next';

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  toAddressId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
};

type ResponseData = {
  id: string;
  chainId: string;
  addressId: string;
  address: string;
  redFlagType: string;
  createdTimestamp: number;
  interactedAddressCount: string[];
  totalAmount: number;
  transactionData: TransactionData[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'id': '1400520038',
    'chainId': 'usdt',
    'addressId': '140052',
    'address': '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW',
    'createdTimestamp': 1686579200,
    'interactedAddressCount': ['140197', '141253', '144282', '149371'],
    'totalAmount': 100,
    'transactionData': [
      {
        'id': '943029',
        'chainId': 'btc',
        'createdTimestamp': 1686579229,
        'toAddressId': '123452',
        'status': 'SUCCESS',
      },
      {
        'id': '944291',
        'chainId': 'btc',
        'createdTimestamp': 1687860718,
        'toAddressId': '181716',
        'status': 'PENDING',
      },
      //...
    ],
  };
  res.status(200).json(result);
}
