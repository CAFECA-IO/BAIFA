// 012 - GET /app/chains/:chain_id/addresses/:address_id/reviews

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';

type ReviewData = {
  id: string;
  transactionId: string;
  chainId: string;
  createdTimestamp: number;
  authorAddressId: string;
  content: string;
  stars: number;
};

type ResponseData = {
  id: string;
  address: string;
  score: number;
  chainIcon: string;
  reviewData: ReviewData[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  const {chains_id, address_id} = req.query;

  try {
    // Info: 從 addresses 表中取得特定地址的評分 (20240130 - Shirley)
    const addressData = await prisma.addresses.findUnique({
      where: {
        address: `${address_id}`,
      },
      select: {
        id: true,
        chain_id: true,
        address: true,
        score: true,
        created_timestamp: true,
      },
    });

    // Info: 取得與該地址相關的所有評論 (20240130 - Shirley)
    const reviews = await prisma.review_datas.findMany({
      where: {
        target: `${address_id}`,
      },
      select: {
        id: true,
        created_timestamp: true,
        author_address: true,
        content: true,
        stars: true,
        // transaction_id: string; // TODO: no property named transaction_id in review_datas table (20240130 - Shirley)
      },
    });

    const result: ResponseData = {
      id: `${addressData?.id ?? address_id}`,
      address: `${addressData?.address ?? address_id}`,
      score: addressData?.score ?? 0,
      chainIcon: '', // TODO: to be removed (20240130 - Shirley)
      reviewData: reviews.map(r => ({
        id: `${r.id ?? ''}`,
        transactionId: '', // TODO: no property named transaction_id in review_datas table (20240130 - Shirley)
        chainId: `${addressData?.chain_id ?? chains_id}`,
        createdTimestamp: r?.created_timestamp?.getTime() / 1000 ?? 0,
        authorAddressId: r?.author_address ?? '',
        content: r?.content ?? '',
        stars: r?.stars ?? 0,
      })),
    };

    /* Deprecated: (20240205 - Shirley) -------------- Mock Data -------------- 
    const result: ResponseData = {
      'id': '115588',
      'address': '0x2775D3190693fEc256d156f9f74Cd8843A79',
      'score': 2.8,
      'chainIcon': '/currencies/eth.svg',
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
    */
    res.status(200).json(result);
  } catch (error) {
    // Info: (20240130 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('review request', error);
    res.status(500).json({} as ResponseData);
  }
}
