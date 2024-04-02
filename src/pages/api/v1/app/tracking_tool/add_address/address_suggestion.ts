// 102 - GET /app/tracking-tool address suggestion
import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../prisma/client';
import {INPUT_SUGGESTION_LIMIT} from '../../../../../../constants/config';

type ResponseData = string[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const searchInput = req.query.search_input as string;

  if (!searchInput) {
    return res.status(200).json([]);
  }

  try {
    const addresses = await prisma.addresses.findMany({
      where: {
        OR: [
          {
            address: {
              contains: searchInput,
              mode: 'insensitive', // Info: (20240402 - Julian) 不區分大小寫
            },
          },
        ],
      },
      take: INPUT_SUGGESTION_LIMIT,
      select: {
        id: true,
        address: true,
      },
    });

    const suggestions = addresses
      .map(address => address.address)
      .filter(suggestion => suggestion !== 'null')
      .slice(0, INPUT_SUGGESTION_LIMIT) as string[];

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json([]);
  }
}
