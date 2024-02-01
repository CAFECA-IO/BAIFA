// 020 - GET /app/blacklist

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';

type ResponseData = {
  id: string;
  chainId: string;
  latestActiveTime: number;
  flaggingRecords: string[];
  publicTag: string[];
}[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240201 - Julian) 從 DB 撈出所有 black_lists 的資料
  const blacklistData = await prisma.black_lists.findMany({
    select: {
      id: true,
      chain_id: true,
      address_id: true,
      created_timestamp: true,
      public_tag: true,
    },
  });

  const result: ResponseData = blacklistData.map(item => {
    return {
      id: `${item.address_id}`,
      chainId: `${item.chain_id}`,
      latestActiveTime: item.created_timestamp ?? 0,
      flaggingRecords: [], // ToDo: (20240130 - Julian) 補上這個欄位
      publicTag: [], // ToDo: (20240130 - Julian) 這邊要串 public tag 的資料
    };
  });

  prisma.$connect();
  res.status(200).json(result);
}
