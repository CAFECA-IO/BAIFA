import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../../../../prisma/client';
import {INPUT_SUGGESTION_LIMIT} from '../../../../../../../../../constants/config';

type ResponseData = {
  suggestions: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;
  const chain_id =
    typeof req.query.chain_id === 'string' ? parseInt(req.query.chain_id) : undefined;
  const searchInput = req.query.search_input as string;

  if (!address_id || !chain_id) {
    return res.status(400).json({suggestions: []});
  } else if (!searchInput) {
    return res.status(200).json({suggestions: []});
  }

  try {
    const suggestions = new Set();

    const transactions = await prisma.transactions.findMany({
      where: {
        AND: [
          {hash: {startsWith: searchInput}},
          {related_addresses: {hasSome: [address_id]}},
          {chain_id: chain_id},
        ],
      },
      take: INPUT_SUGGESTION_LIMIT,
      select: {
        hash: true,
      },
    });

    transactions.forEach(item => {
      if (item.hash && item.hash.startsWith(searchInput)) {
        suggestions.add(item.hash);
      }
    });

    const limitedSuggestions = Array.from(suggestions).slice(0, 5) as string[];

    return res.status(200).json({suggestions: limitedSuggestions});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching suggestions for transactions of address', error);
    return res.status(500).json({suggestions: []});
  }
}
