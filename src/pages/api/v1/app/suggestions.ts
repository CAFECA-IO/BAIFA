// 002 - GET /app/suggestions?search_input=${searchInput}

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {INPUT_SUGGESTION_LIMIT} from '../../../../constants/config';

type ResponseData = {
  suggestions: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  const searchInput = req.query.search_input as string;

  if (!searchInput) {
    return res.status(400).json({suggestions: []});
  }

  try {
    const suggestions = new Set();

    // Info: Search in evidences for contract_address (20240130 - Shirley)
    if (suggestions.size < INPUT_SUGGESTION_LIMIT) {
      const evidences = await prisma.evidences.findMany({
        where: {
          contract_address: {
            startsWith: searchInput,
          },
        },
        take: INPUT_SUGGESTION_LIMIT - suggestions.size,
        select: {
          contract_address: true,
        },
      });

      evidences.forEach(item => {
        if (item.contract_address) {
          suggestions.add(item.contract_address);
        }
      });
    }

    // Info: Search in red_flags for related_addresses (20240130 - Shirley)
    if (suggestions.size < INPUT_SUGGESTION_LIMIT) {
      const redFlags = await prisma.red_flags.findMany({
        where: {
          related_addresses: {
            has: searchInput,
          },
        },
        take: INPUT_SUGGESTION_LIMIT - suggestions.size,
        select: {
          related_addresses: true,
        },
      });

      redFlags.forEach(item => {
        if (item.related_addresses && item.related_addresses.includes(searchInput)) {
          item.related_addresses.forEach(address => {
            if (address.startsWith(searchInput)) {
              suggestions.add(address);
            }
          });
        }
      });
    }

    // Info: Search transaction has in transaction_raw (20240130 - Shirley)
    const transactionRaw = await prisma.transaction_raw.findMany({
      where: {
        OR: [
          {hash: {startsWith: searchInput}},
          {from: {startsWith: searchInput}},
          {to: {startsWith: searchInput}},
          {block_hash: {startsWith: searchInput}},
        ],
      },
      take: INPUT_SUGGESTION_LIMIT,
      select: {
        hash: true,
        from: true,
        to: true,
        block_hash: true,
      },
    });

    transactionRaw.forEach(item => {
      if (item.hash && item.hash.startsWith(searchInput)) {
        suggestions.add(item.hash);
      } else if (item.from && item.from.startsWith(searchInput)) {
        suggestions.add(item.from);
      } else if (item.to && item.to.startsWith(searchInput)) {
        suggestions.add(item.to);
      } else if (item.block_hash && item.block_hash.startsWith(searchInput)) {
        suggestions.add(item.block_hash);
      }
    });

    // Info: If fewer than INPUT_SUGGESTION_LIMIT results, search in contracts for contract_address and creator_address (20240130 - Shirley)
    if (suggestions.size < INPUT_SUGGESTION_LIMIT) {
      const contracts = await prisma.contracts.findMany({
        where: {
          OR: [
            {contract_address: {startsWith: searchInput}},
            {creator_address: {startsWith: searchInput}},
          ],
        },
        take: INPUT_SUGGESTION_LIMIT - suggestions.size,
        select: {
          contract_address: true,
          creator_address: true,
        },
      });

      contracts.forEach(item => {
        if (item.contract_address && item.contract_address.startsWith(searchInput)) {
          suggestions.add(item.contract_address);
        } else if (item.creator_address && item.creator_address.startsWith(searchInput)) {
          suggestions.add(item.creator_address);
        }
      });
    }

    const limitedSuggestions = Array.from(suggestions)
      .filter(suggestion => suggestion !== 'null')
      .slice(0, INPUT_SUGGESTION_LIMIT) as string[];

    res.status(200).json({suggestions: limitedSuggestions} as ResponseData);
  } catch (error) {
    // Info: (20240130 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('Suggestion request', error);
    res.status(500).json({suggestions: []});
  }
}
