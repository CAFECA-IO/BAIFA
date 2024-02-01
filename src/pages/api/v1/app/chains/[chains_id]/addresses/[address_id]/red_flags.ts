// 013 - GET /app/chains/:chain_id/addresses/:address_id/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';

type ResponseData = {
  id: string;
  chainId: string;
  chainName: string;
  addressId: string;
  redFlagType: string;
  createdTimestamp: number;
}[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240129 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;

  const redFlagData = address_id
    ? await prisma.red_flags.findMany({
        where: {
          related_addresses: {
            hasSome: [address_id],
          },
        },
        select: {
          id: true,
          chain_id: true,
          red_flag_type: true,
          created_timestamp: true,
        },
      })
    : [];

  // Info: (20240129 - Julian) 取得 chain 資料
  const chainData = await prisma.chains.findUnique({
    where: {
      id: chain_id,
    },
    select: {
      id: true,
      chain_name: true,
    },
  });

  const chainName = chainData?.chain_name ?? '';

  const result: ResponseData = redFlagData.map(redFlag => {
    return {
      id: `${redFlag.id}`,
      chainId: `${redFlag.chain_id}`,
      chainName: chainName,
      addressId: address_id ?? '',
      redFlagType: `${redFlag.red_flag_type}`,
      createdTimestamp: redFlag.created_timestamp ?? 0,
    };
  });

  res.status(200).json(result);
}
