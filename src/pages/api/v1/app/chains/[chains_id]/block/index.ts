// 006 - GET /app/chains/:chain_id/blocks?start_date=${startTimestamp}&end_date=${endTimestamp}

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../../prisma/client';
import {ITEM_PER_PAGE} from '../../../../../../../constants/config';
import {IBlock, IBlockList} from '../../../../../../../interfaces/block';

type ResponseData = IBlockList;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  // Info: (20240221 - Julian) query string
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;
  // const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const start_date =
    typeof req.query.start_date === 'string' ? parseInt(req.query.start_date) : undefined;
  const end_date =
    typeof req.query.end_date === 'string' ? parseInt(req.query.end_date) : undefined;

  // eslint-disable-next-line no-console
  console.log('sort in block/index.ts:', sort);

  try {
    // Info: (20240119 - Julian) 計算分頁的 skip 與 take
    const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // (20240119 - Julian) 跳過前面幾筆
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
    // Info: (20240221 - Julian) 排序
    // const sorting = sort === 'SORTING.OLDEST' ? 'asc' : 'desc';

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
      },
      // Info: (20240222 - Julian) 排序方式：
      orderBy: [
        {
          // Info: (20240222 - Julian) 1. created_timestamp 由 sorting 決定
          created_timestamp: sort,
        },
        {
          // Info: (20240222 - Julian) 2. id 由小到大
          id: sort,
        },
      ],
      // Info: (20240119 - Julian) 分頁
      skip: skip,
      take: take,
    });

    const blockList: IBlock[] = blocks.map(block => {
      return {
        id: `${block.number}`,
        chainId: `${block.chain_id}`,
        createdTimestamp: block.created_timestamp ?? 0,
        // ToDo: (20240118 - Julian) 參考 codes Table，補上這個欄位
        stability: 'HIGH',
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
