// 021 - GET /app/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../lib/utils/prismaUtils';

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
  // Info:(20240118 - Liz) 從 DB 撈出所有 redFlags 的資料
  const redFlags = await prisma.red_flags.findMany({
    select: {
      id: true,
      chain_id: true,
      created_timestamp: true,
      red_flag_type: true,
      chains: {
        select: {
          chain_name: true,
        },
      },
    },
  });

  // Info:(20240118 - Liz) 將撈出來的資料轉換成 API 要的格式
  const result: ResponseData = redFlags.map(redFlag => {
    return {
      id: `${redFlag.id}`,
      chainId: `${redFlag.chain_id}`,
      chainName: `${redFlag.chains?.chain_name}`,
      addressId: '', // ToDo: 廢棄欄位
      redFlagType: `${redFlag.red_flag_type}`,
      createdTimestamp: redFlag.created_timestamp ?? 0,
    };
  });

  prisma.$disconnect();
  res.status(200).json(result);
}
