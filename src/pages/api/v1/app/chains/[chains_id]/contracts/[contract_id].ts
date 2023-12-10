// 015 - GET /app/chains/:chain_id/contracts/:contract_id

import type {NextApiRequest, NextApiResponse} from 'next';

type TransactionData = {
  id: string;
  createdTimestamp: number;
  toAddressId: string;
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
  transactionData: TransactionData[];
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
    'transactionData': [
      {
        'id': '930918',
        'createdTimestamp': 1689957331,
        'toAddressId': '329013',
        'status': 'SUCCESS',
      },
      {
        'id': '932726',
        'createdTimestamp': 1692977381,
        'toAddressId': '339103',
        'status': 'PENDING',
      },
      //...
    ],
    'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
  };
  res.status(200).json(result);
}
