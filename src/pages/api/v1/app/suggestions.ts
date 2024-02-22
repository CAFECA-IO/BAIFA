// 002 - GET /app/suggestions?search_input=${searchInput}

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {INPUT_SUGGESTION_LIMIT} from '../../../../constants/config';
import {isValid64BitInteger} from '../../../../lib/common';

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
    const searchId = isValid64BitInteger(searchInput) ? parseInt(searchInput, 10) : undefined;

    // Info: If fewer than INPUT_SUGGESTION_LIMIT results, search in contracts for contract_address and creator_address (20240130 - Shirley)
    if (suggestions.size < INPUT_SUGGESTION_LIMIT) {
      const contracts = await prisma.contracts.findMany({
        where: {
          contract_address: {startsWith: searchInput},
        },
        take: INPUT_SUGGESTION_LIMIT - suggestions.size,
        select: {
          contract_address: true,
        },
      });

      contracts.forEach(item => {
        if (item.contract_address && item.contract_address.startsWith(searchInput)) {
          suggestions.add(item.contract_address);
        }
      });
    }

    // Info: Search in evidences for contract_address (20240130 - Shirley)
    if (suggestions.size < INPUT_SUGGESTION_LIMIT) {
      const evidences = await prisma.evidences.findMany({
        where: {
          OR: [
            {contract_address: {startsWith: searchInput}},
            {evidence_id: {startsWith: searchInput}},
          ],
        },
        take: INPUT_SUGGESTION_LIMIT - suggestions.size,
        select: {
          contract_address: true,
          evidence_id: true,
        },
      });

      evidences.forEach(item => {
        if (item.evidence_id && item.evidence_id.startsWith(searchInput)) {
          suggestions.add(item.evidence_id);
        }
      });
    }

    // Info: Search hash, addresses in transactions (20240201 - Shirley)
    if (suggestions.size < INPUT_SUGGESTION_LIMIT) {
      const transactions = await prisma.transactions.findMany({
        where: {
          OR: [
            {hash: {startsWith: searchInput}},
            {from_address: {startsWith: searchInput}},
            {to_address: {startsWith: searchInput}},
          ],
        },
        take: INPUT_SUGGESTION_LIMIT - suggestions.size,
        select: {
          hash: true,
          from_address: true,
          to_address: true,
        },
      });

      transactions.forEach(item => {
        if (item.hash && item.hash.startsWith(searchInput)) {
          suggestions.add(item.hash);
        }
        if (item.from_address && item.from_address.startsWith(searchInput)) {
          suggestions.add(item.from_address);
        }
        if (item.to_address && item.to_address.startsWith(searchInput)) {
          suggestions.add(item.to_address);
        }
      });
    }

    // Info: search hash in blocks (20240130 - Shirley)
    if (suggestions.size < INPUT_SUGGESTION_LIMIT && !!searchId) {
      const blocks = await prisma.blocks.findMany({
        where: {
          number: searchId,
        },
        take: INPUT_SUGGESTION_LIMIT - suggestions.size,
        select: {
          number: true,
        },
      });

      blocks.forEach(item => {
        // eslint-disable-next-line no-console
        console.log(
          'block item number',
          item.number,
          'searchId',
          searchId,
          'searchInput',
          searchInput
        );
        if (item.number === +searchInput) {
          suggestions.add(item.number);
        }
      });
    }

    const limitedSuggestions = Array.from(suggestions)
      .filter(suggestion => suggestion !== 'null')
      .slice(0, INPUT_SUGGESTION_LIMIT) as string[];

    // eslint-disable-next-line no-console
    console.log('suggestion API', limitedSuggestions);

    res.status(200).json({suggestions: limitedSuggestions} as ResponseData);
  } catch (error) {
    // Info: (20240130 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('Suggestion request', error);
    res.status(500).json({suggestions: []});
  }
}
