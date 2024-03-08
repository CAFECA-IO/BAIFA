// 014 - GET /app/chains/:chain_id/addresses/:address_id/interactions?type=address

import type {NextApiRequest, NextApiResponse} from 'next';
import {IInteractionItem} from '../../../../../../../../interfaces/interaction_item';
import {AddressType} from '../../../../../../../../interfaces/address_info';
import prisma from '../../../../../../../../../prisma/client';

type ResponseData = IInteractionItem[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;

  if (!chain_id || !address_id) {
    res.status(400).json([]);
    return;
  }

  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        related_addresses: {
          has: address_id,
        },
      },
      select: {
        related_addresses: true,
      },
    });

    const addressTransactionCountMap = new Map<string, number>();
    transactions.forEach(transaction => {
      transaction.related_addresses.forEach(relatedAddress => {
        if (relatedAddress !== address_id && relatedAddress !== 'null') {
          addressTransactionCountMap.set(
            relatedAddress,
            (addressTransactionCountMap.get(relatedAddress) || 0) + 1
          );
        }
      });
    });

    const uniqueInteractedAddresses = Array.from(addressTransactionCountMap.keys());

    const interactedAddresses = await prisma.addresses.findMany({
      where: {
        address: {
          in: uniqueInteractedAddresses,
        },
      },
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        address: true,
      },
    });

    const interactedContracts = await prisma.contracts.findMany({
      where: {
        contract_address: {
          in: uniqueInteractedAddresses,
        },
      },
      select: {
        id: true,
        chain_id: true,
        contract_address: true,
        created_timestamp: true,
      },
    });

    const publicTags = await prisma.public_tags.findMany({
      where: {
        target: {
          in: uniqueInteractedAddresses,
        },
      },
      select: {
        target: true,
        name: true,
      },
    });

    const publicTagMap = new Map<string, string[]>();

    // Info: make publicTagMap by iterating publicTags, if target not in publicTagMap, skip it (20240227 - Shirley)
    publicTags.forEach(publicTag => {
      if (publicTag === null) return;

      const tags = publicTagMap.get(publicTag.target ?? '') || [];
      if (publicTag.name !== null) {
        tags.push(publicTag.name);
      }
      publicTagMap.set(publicTag.target ?? '', tags);
    });

    const result: ResponseData = interactedAddresses
      .map(interacted => ({
        id: `${interacted.address}`,
        type: AddressType.ADDRESS,
        chainId: `${chain_id}`,
        publicTag: publicTagMap.get(interacted?.address ?? '') || ['Unknown User'], // Info: Assign a default value of ['Unknown User'] if publicTag is undefined (20240227 - Shirley)
        createdTimestamp: interacted.created_timestamp ?? 0,
        transactionCount: addressTransactionCountMap.get(interacted?.address ?? '') || 0,
      }))
      .concat(
        interactedContracts.map(interacted => ({
          id: `${interacted.contract_address}`,
          type: AddressType.CONTRACT,
          chainId: `${chain_id}`,
          publicTag: publicTagMap.get(interacted?.contract_address ?? '') || ['Unknown User'], // Info: Assign a default value of ['Unknown Contract'] if publicTag is undefined (20240227 - Shirley)
          createdTimestamp: interacted.created_timestamp ?? 0,
          transactionCount: addressTransactionCountMap.get(interacted?.contract_address ?? '') || 0,
        }))
      );

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching interactions:', error);
    res.status(500).json([]);
  }
}
