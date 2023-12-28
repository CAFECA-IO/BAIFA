// 015 - GET /app/chains/:chain_id/contracts/:contract_id

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
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type ResponseData = {
  id: string;
  type: 'contract';
  contractAddress: string;
  chainId: string;
  creatorAddressId: string;
  createdTimestamp: number;
  sourceCode: string;
  transactionHistoryData: TransactionData[];
  publicTag: string[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'id': '330029',
    'type': 'contract',
    'contractAddress': '0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43',
    'chainId': 'isun',
    'creatorAddressId': '130008',
    'createdTimestamp': 1688341795,
    'sourceCode': '',
    'transactionHistoryData': [
      {
        'id': '931314',
        'chainId': 'isun',
        'createdTimestamp': 1607957394,
        'from': [
          {'type': 'address', 'address': '130008'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'to': [
          {'type': 'contract', 'address': '330029'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'type': 'Evidence',
        'status': 'SUCCESS',
      },
      //...
    ],
    'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
  };

  res.status(200).json(result);
}
