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
      // ToDo: (20420118 - Liz) 沒有下面這兩個欄位，要去哪找？
      // chain_name: true,
      // address_id: true,
    },
  });
  // Info:(20240118 - Liz) 將撈出來的資料轉換成 API 要的格式

  const result: ResponseData = redFlags.map(redFlag => {
    const id = redFlag.id.toString();
    const chainId = redFlag.chain_id.toString();
    const createdTimestamp = redFlag.created_timestamp.getTime() / 1000; // Info: (20240118 - Liz) 除以 1000 將單位毫秒轉換為秒

    return {
      id,
      chainId,
      chainName: 'Ethereum', // ToDo: (20240118 - Liz)找到欄位後補回變數
      addressId: '122372', // ToDo: (20240118 - Liz)找到欄位後補回變數
      redFlagType: redFlag.red_flag_type,
      createdTimestamp,
    };
  });

  // Info:(20240118 - Liz) 回傳資料
  res.status(200).json(result);

  /* Mock Data
  const result: ResponseData = [
    {
      'id': '1223724980',
      'chainId': 'eth',
      'chainName': 'Ethereum',
      'addressId': '122372',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_TRANSFER',
      'createdTimestamp': 1677769870,
    },
    {
      'id': '1132480029',
      'chainId': 'btc',
      'chainName': 'Bitcoin',
      'addressId': '113248',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
      'createdTimestamp': 1682172429,
    },
    {
      'id': '1468697785',
      'chainId': 'usdt',
      'chainName': 'Tether',
      'addressId': '146869',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_GAMBLING_SITE',
      'createdTimestamp': 1686548904,
    },
    {
      'id': '1378976701',
      'chainId': 'isun',
      'chainName': 'iSunCloud',
      'addressId': '137897',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_DEPOSIT',
      'createdTimestamp': 1690657412,
    },
    // ... other red flags
  ];
  res.status(200).json(result);
   */
}
