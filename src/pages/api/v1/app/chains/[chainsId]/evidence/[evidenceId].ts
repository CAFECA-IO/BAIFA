// /app/chains/:chainId/evidence/:evidenceId

import type {NextApiRequest, NextApiResponse} from 'next';

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  toAddressId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type ResponseData = {
  id: string;
  chainId: string;
  evidenceAddress: string;
  state: 'Active' | 'Inactive';
  creatorAddressId: string;
  createdTimestamp: number;
  content: string;
  transactionData: TransactionData[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'id': '510071',
    'chainId': 'btc',
    'evidenceAddress': '0x2326ce42a513a427a1ab5045a684e0a8ee8e96a13',
    'state': 'Active',
    'creatorAddressId': '114007',
    'createdTimestamp': 1687103913,
    'content': '',
    'transactionData': [
      {
        'id': '918436',
        'chainId': 'btc',
        'createdTimestamp': 1682817342,
        'toAddressId': '313823',
        'status': 'FAILED',
      },
      {
        'id': '913827',
        'chainId': 'btc',
        'createdTimestamp': 1684029313,
        'toAddressId': '309135',
        'status': 'SUCCESS',
      },
      //...
    ],
  };
  res.status(200).json(result);
}
