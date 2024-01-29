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
    return {
      id: `${item.address_id}`,
      chainId: `${item.chain_id}`,
      latestActiveTime: new Date(item.created_timestamp).getTime() / 1000,
      flaggingRecords: [],
      publicTag: [item.public_tag],
    };
  });

  res.status(200).json(result);
}
