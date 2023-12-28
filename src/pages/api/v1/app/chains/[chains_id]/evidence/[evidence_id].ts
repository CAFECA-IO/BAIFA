// 016 - GET /app/chains/:chain_id/evidence/:evidence_id

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
  transactionHistoryData: TransactionData[];
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
    'transactionHistoryData': [
      {
        'id': '915024',
        'chainId': 'btc',
        'createdTimestamp': 1682817342,
        'from': [
          {'type': 'address', 'address': '114007'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'to': [
          {'type': 'contract', 'address': '311382'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'status': 'SUCCESS',
      },
      {
        'id': '912299',
        'chainId': 'btc',
        'createdTimestamp': 1684029313,
        'from': [
          {'type': 'address', 'address': '110132'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'to': [
          {'type': 'contract', 'address': '310683'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'status': 'FAILED',
      },
      //...
    ],
  };

  res.status(200).json(result);
}
