// 012 - GET /app/chains/:chain_id/addresses/:address_id/reviews

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {IReviews} from '../../../../../../../../interfaces/review';

type ResponseData = IReviews;

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
      reviewData: reviews.map(r => ({
        id: `${r.id ?? ''}`,
        transactionId: '', // TODO: no property named transaction_id in review_datas table (20240130 - Shirley)
        chainId: `${addressData?.chain_id ?? chains_id}`,
        createdTimestamp: r.created_timestamp ? r.created_timestamp.getTime() : 0,
        authorAddressId: r?.author_address ?? '',
        content: r?.content ?? '',
        stars: r?.stars ?? 0,
      })),
    };

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240130 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('review request', error);
    res.status(500).json({} as ResponseData);
  }
}
