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

    // Info:Search in transaction_receipt_raw for contract_address (20240130 - Shirley)
    const transactionReceipts = await prisma.transactions.findMany({
      where: {
        // contract_address: {
        //   startsWith: searchInput,
        // },
        OR: [{from_address: {startsWith: searchInput}}, {to_address: {startsWith: searchInput}}],
      },
      take: INPUT_SUGGESTION_LIMIT,
      select: {
        from_address: true,
        to_address: true,
      },
    });

    transactionReceipts.forEach(item => {
      if (item.from_address && item.from_address.startsWith(searchInput)) {
        suggestions.add(item.from_address);
      }

      if (item.to_address && item.to_address.startsWith(searchInput)) {
        suggestions.add(item.to_address);
      }
    });

    // Info:If fewer than INPUT_SUGGESTION_LIMIT results, search in contracts for contract_address and creator_address (20240130 - Shirley)
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
        }
        if (item.creator_address && item.creator_address.startsWith(searchInput)) {
          suggestions.add(item.creator_address);
        }
      });
    }

    // Search in evidences for contract_address
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

    // Search in red_flags for related_addresses
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

    // Search in block_raw for hash
    if (suggestions.size < INPUT_SUGGESTION_LIMIT) {
      const blockRaw = await prisma.block_raw.findMany({
        where: {
          hash: {
            startsWith: searchInput,
          },
        },
        take: INPUT_SUGGESTION_LIMIT - suggestions.size,
        select: {
          hash: true,
        },
      });

      blockRaw.forEach(item => {
        if (item.hash) {
          suggestions.add(item.hash);
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
    console.error('Request error', error);
    res.status(500).json({suggestions: []});
  }
}
