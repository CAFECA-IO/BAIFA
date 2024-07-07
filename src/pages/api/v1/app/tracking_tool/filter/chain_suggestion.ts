// 103 - GET /app/tracking-tool filter chain suggestion
import type {NextApiRequest, NextApiResponse} from 'next';
import {INPUT_SUGGESTION_LIMIT} from '@/constants/config';
import {isValid64BitInteger} from '@/lib/common';
import prisma from '@/lib/utils/prisma';

type ResponseData = string[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const searchInput = req.query.search_input as string;

  if (!searchInput) {
    return res.status(200).json([]);
  }

  try {
    const searchId = isValid64BitInteger(searchInput) ? parseInt(searchInput, 10) : undefined;

    const chains = await prisma.chains.findMany({
      where: {
        OR: [
          {
            chain_name: {
              contains: searchInput,
              mode: 'insensitive', // Info: (20240402 - Julian) 不區分大小寫
            },
          },
          {id: searchId},
        ],
      },
      take: INPUT_SUGGESTION_LIMIT,
      select: {
        id: true,
        chain_name: true,
      },
    });

    const suggestions = chains
      .map(chain => chain.chain_name)
      .filter(suggestion => suggestion !== 'null')
      .slice(0, INPUT_SUGGESTION_LIMIT) as string[];

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json([]);
  }
}
