// 012 - GET /app/chains/:chain_id/addresses/:address_id/reviews

import type {NextApiRequest, NextApiResponse} from 'next';
import {IReviews} from '../../../../../../../../interfaces/review';

type ResponseData = IReviews;

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'id': '115588',
    'address': '0x2775D3190693fEc256d156f9f74Cd8843A79',
    'score': 2.8,
    'reviewData': [
      {
        'id': 'T99283100001',
        'transactionId': '992831',
        'chainId': 'eth',
        'createdTimestamp': 1675289690,
        'authorAddressId': '392801',
        'content': 'This is a review',
        'stars': 3,
      },
      {
        'id': 'T99283100002',
        'transactionId': '992831',
        'chainId': 'eth',
        'createdTimestamp': 1675351393,
        'authorAddressId': '331824',
        'content': 'This is a review',
        'stars': 2,
      },
      {
        'id': 'T93823000002',
        'transactionId': '938230',
        'chainId': 'eth',
        'createdTimestamp': 1679589352,
        'authorAddressId': '327923',
        'content': 'This is a review',
        'stars': 5,
      },
      {
        'id': 'T98139400002',
        'transactionId': '981394',
        'chainId': 'eth',
        'createdTimestamp': 1684378204,
        'authorAddressId': '322372',
        'content': 'This is a review',
        'stars': 1,
      },
      //...
    ],
  };

  res.status(200).json(result);
}
