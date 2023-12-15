// 022 - GET /app/red_flags/:red_flag_id

import type {NextApiRequest, NextApiResponse} from 'next';

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  from: AddressInfo[];
  to: AddressInfo[];
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
    'id': '140050038',
    'chainId': 'usdt',
    'addressId': '140052',
    'address': '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW',
    'createdTimestamp': 1686579200,
    'interactedAddressCount': ['140197', '141253', '144282', '149371'],
    'totalAmount': 100,
    'transactionData': [
      {
        'id': '918402',
        'chainId': 'btc',
        'createdTimestamp': 1686579229,
        'from': [{'type': 'address', 'address': '912299'}],
        'to': [{'type': 'contract', 'address': '110132'}],
        'status': 'SUCCESS',
      },
      {
        'id': '912299',
        'chainId': 'btc',
        'createdTimestamp': 1687860718,
        'from': [{'type': 'address', 'address': '110132'}],
        'to': [{'type': 'contract', 'address': '310683'}],
        'status': 'PENDING',
      },
      //...
    ],
  };
  res.status(200).json(result);
}
