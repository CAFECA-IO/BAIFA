// 023 - GET /app/chains/:chain_id/addresses/:address_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {AddressType} from '../../../../../../../../interfaces/address_info';
import {IAddressProducedBlock} from '../../../../../../../../interfaces/address';
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
  const start_date =
    typeof req.query.start_date === 'string' ? parseInt(req.query.start_date, 10) : undefined;
  const end_date =
    typeof req.query.end_date === 'string' ? parseInt(req.query.end_date, 10) : undefined;
  // const block_id = typeof req.query.query === 'string' ? parseInt(req.query.block_id, 10) : 0;

  if (!address_id || !chain_id) {
    return res.status(400).json(undefined);
  }

  let queryObject;
  try {
    queryObject = req.query.query ? JSON.parse(req.query.query as string) : undefined;
    // TODO: dev (20240216 - Shirley)
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
        id: true,
        symbol: true,
        decimals: true,
      },
    });

    const skip = page > 0 ? (page - 1) * offset : 0;

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
        /* TODO: time range and string query (20240216 - Shirley)
        // created_timestamp: {
        //   gte: begin,
        //   lte: end,
        // },
        // id:
        //   queryObject?.block_id && isValid64BitInteger(queryObject.block_id)
        //     ? +queryObject.block_id
        //     : undefined,
        */
      },
      /* TODO: time range and string query (20240216 - Shirley)
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
      */
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
        number: true,
      },
    });

    const unit = chainData?.symbol ?? '';
    const decimals = chainData?.decimals ?? 0;

    const blockProducedData: IProductionBlock[] = blockData.map(block => {
      const rewardRaw = block.reward ? parseInt(block.reward) : 0;
      const reward = rewardRaw / Math.pow(10, decimals);

      return {
        id: `${block.number}`,
        chainId: `${block.chain_id}`,
        createdTimestamp: block.created_timestamp ?? 0,
        stability: 'MEDIUM', // TODO: block stability (20240207 - Shirley)
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
