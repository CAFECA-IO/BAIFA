// 027 - GET /app/chains/:chain_id/addresses/:address_id/review_list

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {IReviewDetail} from '../../../../../../../../interfaces/review';

type ResponseData = IReviewDetail[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  const {chains_id, address_id} = req.query;

  try {
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

    const result: ResponseData = reviews.map(r => ({
      id: `${r.id ?? ''}`,
      chainId: `${chains_id}`,
      createdTimestamp: r.created_timestamp ? r.created_timestamp : 0,
      authorAddress: r?.author_address ?? '',
      content: r?.content ?? '',
      stars: r?.stars ?? 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240130 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('review request', error);
    res.status(500).json([] as ResponseData);
  }
}
