// 005 - GET /app/chains/:chain_id

import type {NextApiRequest, NextApiResponse} from 'next';

type AddressInfo = {
  type: string;
  address: string;
};

type BlockData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  stability: 'LOW' | 'MEDIUM' | 'HIGH';
};

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  from: AddressInfo[];
  to: AddressInfo[];
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type ResponseData = {
  chainId: string;
  chainName: string;
  chainIcon: string;
  blockData: BlockData[];
  transactionData: TransactionData[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'chainId': 'isun',
    'chainName': 'iSunCloud',
    'chainIcon': '/currencies/isun.svg',
    'blockData': [
      {
        'id': '230020',
        'chainId': 'isun',
        'createdTimestamp': 1673940795,
        'stability': 'MEDIUM',
      },
      {
        'id': '230021',
        'chainId': 'isun',
        'createdTimestamp': 1679978900,
        'stability': 'HIGH',
      },
      {
        'id': '230022',
        'chainId': 'isun',
        'createdTimestamp': 1680176231,
        'stability': 'LOW',
      },
      //...
    ],
    'transactionData': [
      {
        'id': '930071',
        'chainId': 'isun',
        'createdTimestamp': 1607957394,
        'from': [
          {'type': 'address', 'address': '130294'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'to': [
          {'type': 'contract', 'address': '310071'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'type': 'Crypto Currency',
        'status': 'SUCCESS',
      },
      {
        'id': '930291',
        'chainId': 'isun',
        'createdTimestamp': 1679978900,
        'from': [
          {'type': 'address', 'address': '130682'},
          // ...
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'to': [
          {'type': 'contract', 'address': '310071'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'type': 'Evidence',
        'status': 'FAILED',
      },
      {
        'id': '930032',
        'chainId': 'isun',
        'createdTimestamp': 1680176231,
        'from': [
          {'type': 'address', 'address': '130008'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'to': [
          {'type': 'contract', 'address': '310029'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'type': 'NFT',
        'status': 'PENDING',
      },
      //...
    ],
  };

  res.status(200).json(result);
}
