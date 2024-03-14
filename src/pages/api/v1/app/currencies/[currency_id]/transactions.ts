// 030 - GET /app/currencies/:currency_id/transactions

import {NextApiRequest, NextApiResponse} from 'next';
import {ITransactionsOfCurrency} from '../../../../../../interfaces/currency';

type ResponseData = ITransactionsOfCurrency;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result = {
    'transactionHistoryData': [
      {
        'id': '0x4507de0220ac5aaba6502acaadfaf8eade04a7900188de50e75bd7e894d69596',
        'chainId': '8017',
        'createdTimestamp': 1702615885,
        'from': [
          {
            'type': 'address',
            'address': '0x048adee1b0e93b30f9f7b71f18b963ca9ba5de3b',
          },
        ],
        'to': [
          {
            'type': 'address',
            'address': '0x87b966e36cc1f3a2b855ffff904f6f6acaaec1db',
          },
        ],
        'type': 'Crypto Currency',
        'status': 'Success',
      },
      // ... other transactions
    ],
    'totalPages': 10,
  };
  return res.status(200).json(result);
}
