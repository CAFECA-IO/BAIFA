// 022 - GET /app/red_flags/:red_flag_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {IRedFlagDetail} from '../../../../../interfaces/red_flag';

type ResponseData = IRedFlagDetail | undefined;

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'id': '140050038',
    'chainId': 'usdt',
    'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW',
    'createdTimestamp': 1686579200,
    'interactedAddresses': [
      {
        'id': '122134',
        'chainId': 'eth',
      },
      {
        'id': '134325',
        'chainId': 'usdt',
      },
    ],
    'totalAmount': 100,
    'unit': 'USDT',
    'transactionHistoryData': [
      {
        'id': '918402',
        'chainId': 'btc',
        'createdTimestamp': 1686579229,
        'from': [{'type': 'address', 'address': '912299'}],
        'to': [{'type': 'contract', 'address': '110132'}],
        'status': 'SUCCESS',
        'type': 'Crypto Currency',
      },
      {
        'id': '912299',
        'chainId': 'btc',
        'createdTimestamp': 1687860718,
        'from': [{'type': 'address', 'address': '110132'}],
        'to': [{'type': 'contract', 'address': '310683'}],
        'status': 'PENDING',
        'type': 'Crypto Currency',
      },
      //...
    ],
  };
  res.status(200).json(result);
}
