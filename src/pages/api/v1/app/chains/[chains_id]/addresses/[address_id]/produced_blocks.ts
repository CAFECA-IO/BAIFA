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
import {isValid64BitInteger} from '../../../../../../../../lib/common';

type ResponseData = IAddressProducedBlock | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const order = (req.query.order as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 0;
  const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : 10;
  const start_date =
    typeof req.query.start_date === 'string' ? parseInt(req.query.start_date, 10) : undefined;
  const end_date =
    typeof req.query.end_date === 'string' ? parseInt(req.query.end_date, 10) : undefined;
  // const block_id = typeof req.query.query === 'string' ? parseInt(req.query.block_id, 10) : 0;

  if (!address_id || !chain_id || !isAddress(address_id)) {
    return res.status(400).json(undefined);
  }

  let queryObject;
  try {
    queryObject = req.query.query ? JSON.parse(req.query.query as string) : undefined;
    // console.log('queryObject in produced_block:', queryObject);
  } catch (error) {
    // console.error('Parsing query parameter failed:', error);
    return res.status(400).json(undefined);
  }

  try {
    /* TODO: input query (20240207 - Shirley)
    // const latestBlock = await prisma.blocks.findFirst({
    //   orderBy: {
    //     created_timestamp: 'desc',
    //   },
    //   select: {
    //     id: true,
    //     chain_id: true,
    //     created_timestamp: true,
    //     hash: true,
    //     number: true,
    //   },
    // });

    // const prefix =
    //   queryObject?.block_id && isValid64BitInteger(queryObject.block_id)
    //     ? queryObject.block_id
    //     : undefined;

    // console.log('block_id in produced_block:', prefix);

    // 根據前綴計算可能的 id 範圍
    // const minPrefixLength = prefix.length + 1; // 最小長度，加一是因為至少還有一位數
    // const maxPrefixLength = latestBlock ? latestBlock.id.toString().length : 4; // 假設 id 最大為四位數
    // const startId = parseInt(prefix + '0'.repeat(minPrefixLength - prefix.length), 10); // 計算起始 id
    // const endId = parseInt(prefix + '9'.repeat(maxPrefixLength - prefix.length), 10); // 計算結束 id
    */

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
        chain_id: chain_id,
      },
    });

    const blockData = await prisma.blocks.findMany({
      where: {
        miner: address_id,
        chain_id: chain_id,
        // created_timestamp: {
        //   gte: begin,
        //   lte: end,
        // },
        // id:
        //   queryObject?.block_id && isValid64BitInteger(queryObject.block_id)
        //     ? +queryObject.block_id
        //     : undefined,
      },
      // where: {
      //   AND: [
      //     {miner: address_id},
      //     {chain_id: chain_id},
      //     // {
      //       // id:
      //       //   queryObject?.block_id && isValid64BitInteger(queryObject.block_id)
      //       //     ? +queryObject.block_id
      //       //     : undefined,
      //     // },
      //   ],
      // },
      orderBy: {
        created_timestamp: order,
      },
      take: offset,
      skip: page > 1 ? skip : 0,
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        reward: true,
      },
    });

    const unit = chainData?.symbol ?? '';
    const decimals = chainData?.decimals ?? 0;

    const blockProducedData: IProductionBlock[] = blockData.map(block => {
      const rewardRaw = block.reward ? parseInt(block.reward) : 0;
      const reward = rewardRaw / Math.pow(10, decimals);

      return {
        id: `${block.id}`,
        chainId: `${block.chain_id}`,
        createdTimestamp: block.created_timestamp ?? 0,
        stability: 'MEDIUM', // TODO: block stability (20240207 - Shirley)
        reward: reward,
        unit: unit,
      };
    });

    const responseData: ResponseData = {
      id: address_id,
      type: AddressType.ADDRESS,
      address: address_id,
      chainId: `${chain_id}`,
      blockData: blockProducedData,
      blockCount: totalCount,
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
