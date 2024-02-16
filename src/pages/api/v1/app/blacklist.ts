// 020 - GET /app/blacklist

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {IBlackList} from '../../../../interfaces/blacklist';

type ResponseData = IBlackList[] | string;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (今天 - Liz) 從 public_tags table 中取得 tag_type = 9 (黑名單標籤) 的資料
  const blacklist = await prisma.public_tags.findMany({
    where: {
      tag_type: '9', // Info: (今天 - Liz) 9:黑名單標籤
    },
    select: {
      id: true,
      name: true, // Info: (今天 - Liz) 標籤名稱
      target: true, // Info: (今天 - Liz) 是個地址
      target_type: true, // Info: (今天 - Liz)  0:contract / 1:address
      tag_type: true,
      created_timestamp: true, // Info: (今天 - Liz) 標籤建立時間
    },
  });

  // Info: (今天 - Liz) 若查無黑名單資料，回傳 404
  if (blacklist === null) {
    res.status(404).send('404 - redFlagData Not Found');
    return;
  }

  // 從blacklistData中提取target值
  const targetValues = blacklist.map(item => item.target);

  // Info: (今天 - Liz) 從 addresses table 中取得黑名單地址的 chain_id
  const addressesData = await prisma.addresses.findMany({
    where: {
      address: {
        in: targetValues.filter(value => value !== null) as string[],
      },
    },
    select: {
      address: true,
      chain_id: true,
      latest_active_time: true,
    },
  });

  // Info: (今天 - Liz) 將取得的資料轉換成 API 要的格式
  const blacklistData = blacklist.map(item => {
    const chainId =
      addressesData
        .find(addressData => addressData.address === item.target)
        ?.chain_id?.toString() || '';

    const latestActiveTime =
      addressesData.find(addressData => addressData.address === item.target)?.latest_active_time ??
      0;

    return {
      id: `${item.id}`,
      chainId,
      createdTimestamp: item.created_timestamp ?? 0,
      address: item.target ?? '',
      tagName: item.name ?? '',
      tagType: item.tag_type ?? '',
      targetType: item.target_type ?? '',
      latestActiveTime,
    };
  });

  const result: ResponseData = blacklistData;

  prisma.$connect();
  res.status(200).json(result);
}
