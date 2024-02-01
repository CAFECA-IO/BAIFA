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
    const createdTimestamp = item.created_timestamp
      ? new Date(item.created_timestamp).getTime() / 1000
      : 0;
    return {
      id: `${item.address_id}`,
      chainId: `${item.chain_id}`,
      latestActiveTime: createdTimestamp,
      flaggingRecords: [], // ToDo: (20240130 - Julian) 補上這個欄位
      publicTag: [], // ToDo: (20240130 - Julian) 這邊要串 public tag 的資料
    };
  });

  res.status(200).json(result);
}
