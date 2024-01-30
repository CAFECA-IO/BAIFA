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
    let suggestions = new Set();

    // Search in transaction_receipt_raw for contract_address
    const transactionReceipts = await prisma.transaction_receipt_raw.findMany({
      where: {
        contract_address: {
          startsWith: searchInput,
        },
      },
      take: INPUT_SUGGESTION_LIMIT,
      select: {
        contract_address: true,
      },
    });

    transactionReceipts.forEach(item => {
      if (item.contract_address) {
        suggestions.add(item.contract_address);
      }
    });

    // If fewer than INPUT_SUGGESTION_LIMIT results, search in contracts for contract_address and creator_address
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
        if (item.contract_address) {
          suggestions.add(item.contract_address);
        }
        if (item.creator_address) {
          suggestions.add(item.creator_address);
        }
      });
    }

    console.log('suggestions', suggestions);

    const limitedSuggestions = Array.from(suggestions).slice(0, INPUT_SUGGESTION_LIMIT) as string[];

    res.status(200).json({suggestions: limitedSuggestions} as ResponseData);
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({suggestions: []});
  }
}
