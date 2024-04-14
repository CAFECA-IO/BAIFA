// 024 - GET /app/chains/:chain_id/addresses/:address_id/produced_blocks

import type {NextApiRequest, NextApiResponse} from 'next';
import {AddressType} from '../../../../../../../../interfaces/address_info';
import {IAddressProducedBlock} from '../../../../../../../../interfaces/address';
import {IProductionBlock} from '../../../../../../../../interfaces/block';
import prisma from '../../../../../../../../../prisma/client';
import {DEFAULT_PAGE, ITEM_PER_PAGE} from '../../../../../../../../constants/config';
import {assessBlockStability} from '../../../../../../../../lib/common';

type ResponseData = IAddressProducedBlock | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;
  const chain_id =
    typeof req.query.chain_id === 'string' ? parseInt(req.query.chain_id) : undefined;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : DEFAULT_PAGE;
  const offset =
    typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : ITEM_PER_PAGE;
  const start_date =
    typeof req.query.start_date === 'string' && parseInt(req.query.start_date, 10) > 0
      ? parseInt(req.query.start_date, 10)
      : undefined;
  const end_date =
    typeof req.query.end_date === 'string' && parseInt(req.query.end_date, 10) > 0
      ? parseInt(req.query.end_date, 10)
      : undefined;
  const search =
    typeof req.query.search === 'string' && !isNaN(+req.query.search)
      ? +req.query.search
      : undefined;

  if (!address_id || !chain_id) {
    return res.status(400).json(undefined);
  }

  try {
    const latestBlock = await prisma.blocks.findFirst({
      orderBy: {
        created_timestamp: 'desc',
      },
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        hash: true,
        number: true,
      },
    });

    const chainData = await prisma.chains.findUnique({
      where: {
        id: chain_id,
      },
      select: {
        id: true,
        symbol: true,
        decimals: true,
      },
    });

    const skip = page > 0 ? (page - 1) * offset : 0;

    const queries = {
      created_timestamp: {
        gte: start_date,
        lte: end_date,
      },
      number: search ? +search : undefined,
    };

    const totalCount = await prisma.blocks.count({
      where: {
        ...queries,
        miner: address_id,
        chain_id: chain_id,
      },
    });

    const blockData = await prisma.blocks.findMany({
      where: {
        ...queries,
        miner: address_id,
        chain_id: chain_id,
      },
      orderBy: {
        created_timestamp: sort,
      },
      take: offset,
      skip: skip,
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        reward: true,
        number: true,
      },
    });

    const unit = chainData?.symbol ?? '';
    const decimals = chainData?.decimals ?? 0;

    const blockProducedData: IProductionBlock[] = blockData.map(block => {
      const rewardRaw = block.reward ? parseInt(block.reward) : 0;
      const reward = rewardRaw / Math.pow(10, decimals);
      const targetBlockId = block.number ? +block.number : 0;
      const stability = assessBlockStability(targetBlockId, latestBlock?.number ?? 0);

      return {
        id: `${block.number}`,
        chainId: `${block.chain_id}`,
        createdTimestamp: block.created_timestamp ?? 0,
        stability: stability,
        reward: reward,
        unit: unit,
      };
    });

    const totalPage = Math.ceil(totalCount / offset);

    const responseData: ResponseData = {
      id: address_id,
      type: AddressType.ADDRESS,
      address: address_id,
      chainId: `${chain_id}`,
      blockData: blockProducedData,
      blockCount: totalCount,
      totalPage: totalPage,
    };

    res.status(200).json(responseData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch block details:', error);
    res.status(500).json(undefined);
  } finally {
    await prisma.$disconnect();
  }
}
