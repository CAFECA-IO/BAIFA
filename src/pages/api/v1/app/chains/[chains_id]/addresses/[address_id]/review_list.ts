// 027 - GET /app/chains/:chain_id/addresses/:address_id/review_list

import type {NextApiRequest, NextApiResponse} from 'next';
import {IReviewDetail} from '../../../../../../../../interfaces/review';
import prisma from '../../../../../../../../../prisma/client';

type ResponseData = IReviewDetail[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const order = (req.query.order as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 0;
  const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : 10;

  if (!chain_id || !address_id) {
    return res.status(400).json([]);
  }

  try {
    const skip = page > 0 ? (page - 1) * offset : 0;

    const addressData = await prisma.addresses.findUnique({
      where: {
        address: `${address_id}`,
      },
      select: {
        chain_id: true,
      },
    });

    if (addressData?.chain_id !== chain_id) {
      return res.status(400).json([]);
    }

    const reviews = await prisma.review_datas.findMany({
      where: {
        target: `${address_id}`,
      },
      orderBy: {
        created_timestamp: order,
      },
      take: offset,
      skip: skip,
      select: {
        id: true,

        created_timestamp: true,
        author_address: true,
        content: true,
        stars: true,
      },
    });

    const result: ResponseData = reviews.map(r => ({
      id: `${r.id ?? ''}`,
      chainId: `${chain_id}`,
      createdTimestamp: r.created_timestamp ? r.created_timestamp : 0,
      authorAddress: r?.author_address ?? '',
      content: r?.content ?? '',
      stars: r?.stars ?? 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('review request', error);
    res.status(500).json([]);
  }
}
