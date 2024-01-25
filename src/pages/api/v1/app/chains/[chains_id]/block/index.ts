// 006 - GET /app/chains/:chain_id/blocks?start_date=${startTimestamp}&end_date=${endTimestamp}

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../lib/utils/prismaUtils';
import {ITEM_PER_PAGE} from '../../../../../../../constants/config';

type BlockData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  stability: 'LOW' | 'MEDIUM' | 'HIGH';
};

type ResponseData = BlockData[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const start_date =
    typeof req.query.start_date === 'string' ? parseInt(req.query.start_date) : undefined;
  const end_date =
    typeof req.query.end_date === 'string' ? parseInt(req.query.end_date) : undefined;
<<<<<<< HEAD:src/pages/api/v1/app/chains/[chains_id]/block/index.ts
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;

  // Info: (20240119 - Julian) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // (20240119 - Julian) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // (20240119 - Julian) 取幾筆
=======
  //const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  //const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;
>>>>>>> 2492a5a (fix 007):src/pages/api/v1/app/chains/[chains_id]/blocks/index.ts

  // Info: (20240112 - Julian) 將 timestamp 轉換成 Date 物件
  const startDate = start_date ? new Date(start_date * 1000) : undefined;
  const endDate = end_date ? new Date(end_date * 1000) : undefined;

<<<<<<< HEAD:src/pages/api/v1/app/chains/[chains_id]/block/index.ts
=======
  // Info: (20240112 - Julian) 將 sort 轉換成 SQL 的排序參數
  // const sortArgument = sort ? (sort === 'SORTING.NEWEST' ? 'desc' : 'asc') : undefined;

>>>>>>> 2492a5a (fix 007):src/pages/api/v1/app/chains/[chains_id]/blocks/index.ts
  const blocks = await prisma.blocks.findMany({
    where: {
      chain_id: chain_id,
      // Info: (20240118 - Julian) 日期區間
      created_timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      chain_id: true,
      created_timestamp: true,
      number: true,
    },
    // Info: (20240119 - Julian) 從新到舊排序
    orderBy: {
      created_timestamp: 'desc',
    },
    // Info: (20240119 - Julian) 分頁
    skip: skip,
    take: take,
  });

  // Info: (20240118 - Julian) 轉換成 API 要的格式
  const result: ResponseData = blocks.map(block => {
    return {
      id: `${block.number}`,
      chainId: `${block.chain_id}`,
      createdTimestamp: new Date(block.created_timestamp).getTime() / 1000,
      // ToDo: (20240118 - Julian) 參考 codes Table，補上這個欄位
      stability: 'HIGH',
    };
  });

  res.status(200).json(result);
}
