// 006 - GET /app/chains/:chain_id/blocks?start_date=${startTimestamp}&end_date=${endTimestamp}

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../../prisma/client';
import {ITEM_PER_PAGE} from '../../../../../../../constants/config';
import {IBlockBrief, IBlockList} from '../../../../../../../interfaces/block';
import {StabilityLevel} from '../../../../../../../constants/stability_level';
import {assessBlockStability} from '../../../../../../../lib/common';

type ResponseData = IBlockList;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  // Info: (20240221 - Julian) query string
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const start_date =
    typeof req.query.start_date === 'string' && parseInt(req.query.start_date, 10) > 0
      ? parseInt(req.query.start_date, 10)
      : undefined;
  const end_date =
    typeof req.query.end_date === 'string' && parseInt(req.query.end_date, 10) > 0
      ? parseInt(req.query.end_date, 10)
      : undefined;

  try {
    let stability = StabilityLevel.LOW;

    // Info: (20240119 - Julian) 計算分頁的 skip 與 take
    const skip = (page - 1) * ITEM_PER_PAGE; // (20240119 - Julian) 跳過前面幾筆
    const take = ITEM_PER_PAGE; // (20240119 - Julian) 取幾筆

    // Info: (20240216 - Julian) 查詢條件
    const where = {
      chain_id: chain_id,
      // Info: (20240118 - Julian) 日期區間
      created_timestamp: {
        gte: start_date,
        lte: end_date,
      },
      // Info: (20240221 - Julian) 關鍵字
      number: search ? parseInt(search) : undefined,
    };

    const latestBlock = await prisma.blocks.findFirst({
      orderBy: {
        created_timestamp: 'desc',
      },
      select: {
        number: true,
      },
    });

    // Info: (20240216 - Julian) 取得 blocks 筆數
    const totalBlocks = await prisma.blocks.count({where});
    // Info: (20240216 - Julian) 取得 blocks 資料
    const blocks = await prisma.blocks.findMany({
      where,
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        number: true,
        miner: true,
        reward: true,
      },
      // Info: (20240222 - Julian) 排序方式：
      orderBy: [
        // Info: (20240314 - Julian) 1. created_timestamp 由 sorting 決定
        {created_timestamp: sort},
        // Info: (20240314 - Julian) 2. id 排序和 created_timestamp 一致
        {id: sort},
      ],
      // Info: (20240119 - Julian) 分頁
      skip: skip,
      take: take,
    });

    // Info: (20240318 - Julian) 從 chains Table 撈出 chain_icon 與 decimals
    const chainData = await prisma.chains.findUnique({
      where: {
        id: chain_id,
      },
      select: {
        symbol: true,
        decimals: true,
      },
    });

    const unit = chainData?.symbol ?? '';
    const decimals = chainData?.decimals ?? 0;

    const blockList: IBlockBrief[] = blocks.map(block => {
      if (latestBlock && latestBlock.number) {
        const targetBlockId = block.number ? +block.number : 0;
        stability = assessBlockStability(targetBlockId, latestBlock.number);
      }

      // Info: (20240318 - Julian) 計算 reward
      const rewardRaw = block?.reward ? parseInt(block?.reward) : 0;
      const reward = rewardRaw / Math.pow(10, decimals);
      return {
        id: `${block.number}`,
        chainId: `${block.chain_id}`,
        createdTimestamp: block.created_timestamp ?? 0,
        stability: stability,
        miner: `${block.miner}`,
        reward: reward,
        unit: unit,
      };
    });

    const totalPages = Math.ceil(totalBlocks / ITEM_PER_PAGE);

    // Info: (20240118 - Julian) 轉換成 API 要的格式
    const result = {
      blocks: blockList,
      totalPages: totalPages,
    };

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch blocks data: ', error);
    res.status(500).json({blocks: [], totalPages: 0});
  } finally {
    await prisma.$disconnect();
  }
}
