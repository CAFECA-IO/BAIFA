// 020 - GET /app/blacklist

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {IBlackList} from '../../../../interfaces/blacklist';

type ResponseData = IBlackList[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  try {
    const publicTags = await prisma.public_tags.findMany({
      where: {
        tag_type: '9',
      },
      select: {
        id: true,
        target: true,
        target_type: true,
        created_timestamp: true,
      },
    });

    const contractTargets = publicTags
      .filter(tag => tag.target_type === '0')
      .map(tag => tag.target as string);
    const addressTargets = publicTags
      .filter(tag => tag.target_type === '1')
      .map(tag => tag.target as string);

    const contractsChainIds = await prisma.contracts.findMany({
      where: {
        contract_address: {in: contractTargets},
      },
      select: {
        contract_address: true,
        chain_id: true,
      },
    });

    const addressesChainIds = await prisma.addresses.findMany({
      where: {
        address: {in: addressTargets},
      },
      select: {
        address: true,
        chain_id: true,
      },
    });

    const chainIdMap = new Map();

    contractsChainIds.forEach(contract =>
      chainIdMap.set(contract.contract_address, contract.chain_id)
    );
    addressesChainIds.forEach(address => chainIdMap.set(address.address, address.chain_id));

    const result = publicTags.map(tag => {
      const chainId = chainIdMap.get(tag.target) ?? '';
      return {
        id: `${tag.id}`,
        chainId: `${chainId}`,
        address: `${tag.target}`,
        latestActiveTime: tag.created_timestamp ?? 0,
        createdTimestamp: tag.created_timestamp ?? 0,
        flaggingRecords: [], // ToDo: (20240130 - Julian) 補上這個欄位
        publicTag: [], // ToDo: (20240130 - Julian) 這邊要串 public tag 的資料
      };
    });

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240216 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching blacklist data:', error);
    res.status(500).json([]);
  }
}
