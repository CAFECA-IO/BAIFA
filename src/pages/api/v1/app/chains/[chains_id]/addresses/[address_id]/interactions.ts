// 014 - GET /app/chains/:chain_id/addresses/:address_id/interactions?type=address

import type {NextApiRequest, NextApiResponse} from 'next';
import {
  IInteractionList,
  IInteractionItem,
} from '../../../../../../../../interfaces/interaction_item';
import {AddressType} from '../../../../../../../../interfaces/address_info';
import prisma from '../../../../../../../../../prisma/client';
import {ITEM_PER_PAGE, sortMostAndLeastOptions} from '../../../../../../../../constants/config';

type ResponseData = IInteractionList;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;

  const type = typeof req.query.type === 'string' ? req.query.type : 'all';
  const sort = typeof req.query.sort === 'string' ? req.query.sort : sortMostAndLeastOptions[0];
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const start_date =
    typeof req.query.start_date === 'string' && parseInt(req.query.start_date, 10) > 0
      ? parseInt(req.query.start_date, 10)
      : undefined;
  const end_date =
    typeof req.query.end_date === 'string' && parseInt(req.query.end_date, 10) > 0
      ? parseInt(req.query.end_date, 10)
      : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
  const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset) : ITEM_PER_PAGE;

  if (!chain_id || !address_id) {
    res.status(400).json({} as ResponseData);
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

    const periodQueries = {
      // Info: (20240312 - Julian) 日期區間
      created_timestamp: {
        gte: start_date,
        lte: end_date,
      },
    };

    // Info: (20240312 - Julian) 取得所有關聯的地址資料
    const interactedAddresses = await prisma.addresses.findMany({
      where: {
        address: {
          in: uniqueInteractedAddresses,
          contains: search,
        },
        ...periodQueries,
      },
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        address: true,
      },
    });

    // Info: (20240312 - Julian) 取得所有關聯的合約資料
    const interactedContracts = await prisma.contracts.findMany({
      where: {
        contract_address: {
          in: uniqueInteractedAddresses,
          contains: search,
        },
        ...periodQueries,
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

    // Info: (20240312 - Julian) 將 interacted Addresses 整理成 IInteractionItem 的格式
    const interactedAddressesData = interactedAddresses.map(interacted => ({
      id: `${interacted.address}`,
      type: AddressType.ADDRESS,
      chainId: `${chain_id}`,
      publicTag: publicTagMap.get(interacted?.address ?? '') || ['Unknown User'], // Info: Assign a default value of ['Unknown User'] if publicTag is undefined (20240227 - Shirley)
      createdTimestamp: interacted.created_timestamp ?? 0,
      transactionCount: addressTransactionCountMap.get(interacted?.address ?? '') || 0,
    }));

    // Info: (20240312 - Julian) 將 interacted Contracts 整理成 IInteractionItem 的格式
    const interactedContractsData = interactedContracts.map(interacted => ({
      id: `${interacted.contract_address}`,
      type: AddressType.CONTRACT,
      chainId: `${chain_id}`,
      publicTag: publicTagMap.get(interacted?.contract_address ?? '') || ['Unknown User'], // Info: Assign a default value of ['Unknown Contract'] if publicTag is undefined (20240227 - Shirley)
      createdTimestamp: interacted.created_timestamp ?? 0,
      transactionCount: addressTransactionCountMap.get(interacted?.contract_address ?? '') || 0,
    }));

    const allInteractedData: IInteractionItem[] =
      interactedAddressesData.concat(interactedContractsData);

    // Info: (20240312 - Julian) 依照分類取得資料
    const filterInteractedData = allInteractedData
      .filter(item => {
        if (type === AddressType.ADDRESS) {
          return item.type === AddressType.ADDRESS;
        }
        if (type === AddressType.CONTRACT) {
          return item.type === AddressType.CONTRACT;
        }
        return true;
      })
      // Info: (20240312 - Julian) 依照交易數量排序
      .sort((a, b) => {
        if (sort === sortMostAndLeastOptions[0]) {
          return a.transactionCount - b.transactionCount;
        }
        return b.transactionCount - a.transactionCount;
      });

    const totalPages = Math.ceil(filterInteractedData.length / offset);

    const result: IInteractionList = {
      // Info: (20240312 - Julian) 依照分頁取得資料
      interactedData: filterInteractedData.slice((page - 1) * offset, page * offset),
      totalPages,
    };

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching interactions:', error);
    res.status(500).json({} as ResponseData);
  }
}
