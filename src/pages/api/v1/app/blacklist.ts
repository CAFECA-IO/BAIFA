// 020 - GET /app/blacklist

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {IBlackList} from '../../../../interfaces/blacklist';

type ResponseData = IBlackList[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  try {
    const blacklistData = await prisma.public_tags.findMany({
      where: {
        tag_type: '9',
      },
      select: {
        id: true,
        target: true,
        target_type: true,
        created_timestamp: true,
      },
    });

    const result: ResponseData = blacklistData.map(item => ({
      id: `${item.id}`,
      chainId: '',
      address: `${item.target}`,
      latestActiveTime: item.created_timestamp ?? 0,
      createdTimestamp: item.created_timestamp ?? 0,
      flaggingRecords: [], // ToDo: (20240130 - Julian) 補上這個欄位
      publicTag: ['9'], // ToDo: (20240130 - Julian) 這邊要串 public tag 的資料
    }));

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240216 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching blacklist data:', error);
    res.status(500).json([]);
  }
}
