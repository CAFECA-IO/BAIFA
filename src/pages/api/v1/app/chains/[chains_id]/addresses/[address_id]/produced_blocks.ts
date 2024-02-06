/*eslint-disable no-console */

// 023 - GET /app/chains/:chain_id/addresses/:address_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {AddressType, IAddressInfo} from '../../../../../../../../interfaces/address_info';
import {
  IAddressProducedBlock,
  IAddressRelatedTransaction,
  dummyAddressProducedBlock,
} from '../../../../../../../../interfaces/address';
import {ITransaction} from '../../../../../../../../interfaces/transaction';
import {isAddress} from 'web3-validator';
import {IProductionBlock} from '../../../../../../../../interfaces/block';

type ResponseData = IAddressProducedBlock | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const order = (req.query.order as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 0;
  const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : 10;

  console.log('all query in produced_block:', order, page, offset, chain_id, address_id);

  if (!address_id || !chain_id) {
    return res.status(400).json(undefined);
  }

  try {
    const chainData = await prisma.chains.findUnique({
      where: {
        id: chain_id,
      },
      select: {
        symbol: true,
        decimals: true,
      },
    });

    const skip = page * offset;
    const totalCount = await prisma.blocks.count({
      where: {
        miner: address_id,
        chain_id: chain_id, // Ensure blocks are filtered by the provided chain ID as well
      },
    });

    const blockData = await prisma.blocks.findMany({
      where: {
        miner: address_id,
        chain_id: chain_id, // Ensure blocks are filtered by the provided chain ID as well
      },
      orderBy: {
        created_timestamp: order,
      },
      take: offset,
      skip: skip,
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        reward: true,
      },
    });

    console.log('blockData in produced_blocks.ts:', blockData);

    const unit = chainData?.symbol ?? '';
    const decimals = chainData?.decimals ?? 0;

    const blockProducedData: IProductionBlock[] = blockData.map(block => {
      const rewardRaw = block.reward ? parseInt(block.reward) : 0;
      const reward = rewardRaw / Math.pow(10, decimals);

      return {
        id: `${block.id}`,
        chainId: `${block.chain_id}`,
        createdTimestamp: block.created_timestamp ?? 0,
        stability: 'MEDIUM', // Placeholder for actual stability logic
        reward: reward,
        unit: unit,
      };
    });

    const responseData: ResponseData = {
      id: address_id,
      type: AddressType.ADDRESS,
      address: address_id,
      chainId: `${chain_id}`,
      blockProducedData: blockProducedData,
      blockCount: totalCount,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Failed to fetch block details:', error);
    res.status(500).json(undefined);
  } finally {
    await prisma.$disconnect();
  }
}
