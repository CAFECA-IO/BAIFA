// 104 - GET /app/tracking-tool filter currency suggestion
import type {NextApiRequest, NextApiResponse} from 'next';
import {INPUT_SUGGESTION_LIMIT} from '@/constants/config';
import prisma from '@/lib/utils/prisma';

type ResponseData = string[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const searchInput = req.query.search_input as string;

  if (!searchInput) {
    return res.status(200).json([]);
  }

  try {
    const currencies = await prisma.currencies.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchInput,
              mode: 'insensitive', // Info: (20240402 - Julian) 不區分大小寫
            },
          },
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
        name: true,
      },
    });

    const suggestions = currencies
      .map(currency => currency.name)
      .filter(suggestion => suggestion !== 'null')
      .slice(0, INPUT_SUGGESTION_LIMIT) as string[];

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json([]);
  }
}
