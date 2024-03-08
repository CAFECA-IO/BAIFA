// 012 - GET /app/chains/:chain_id/addresses/:address_id/reviews

import type {NextApiRequest, NextApiResponse} from 'next';
import {IReviews} from '../../../../../../../../interfaces/review';
import prisma from '../../../../../../../../../prisma/client';

type ResponseData = IReviews;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;
  const chains_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const order = (req.query.order as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
  // Info: Review page 沒有頁數功能，所以暫時不需要寫 page 跟 offset (20240130 - Shirley)
  // const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 0;
  // const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : 10;

  if (!chains_id || !address_id) {
    return res.status(400).json({} as ResponseData);
  }

  try {
    // Info: Review page 沒有頁數功能，所以暫時不需要寫 page 跟 offset (20240130 - Shirley)
    // const skip = page > 0 ? (page - 1) * offset : 0;

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
      orderBy: {
        created_timestamp: order,
      },
      // Info: Review page 沒有頁數功能，所以暫時不需要寫 page 跟 offset (20240130 - Shirley)
      // take: offset,
      // skip: skip,
      select: {
        id: true,
        created_timestamp: true,
        author_address: true,
        content: true,
        stars: true,
      },
    });

    const result: ResponseData = {
      id: `${addressData?.id ?? address_id}`,
      address: `${addressData?.address ?? address_id}`,
      score: addressData?.score ?? 0,
      reviewData: reviews.map(r => ({
        id: `${r.id ?? ''}`,
        chainId: `${addressData?.chain_id ?? chains_id}`,
        createdTimestamp: r.created_timestamp ? r.created_timestamp : 0,
        authorAddress: r?.author_address ?? '',
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
