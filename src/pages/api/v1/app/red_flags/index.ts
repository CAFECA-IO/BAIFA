// 021 - GET /app/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../lib/utils/prismaUtils';
import {IRedFlag} from '../../../../../interfaces/red_flag';

type ResponseData = IRedFlag[] | string;

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

  // Info: (20240205 - Liz) 若查無 redFlags 資料，回傳 404
  if (redFlags === null) {
    res.status(404).send('404 - redFlagData Not Found');
    return;
  }

  // Info: (20240205 - Liz) 從 DB 撈出所有 codes 的資料用來對照
  const codes = await prisma.codes.findMany({
    select: {
      value: true,
      meaning: true,
      table_name: true,
      table_column: true,
    },
  });

  // Info:(20240118 - Liz) 將撈出來的資料轉換成 API 要的格式
  const redFlagsData = redFlags.map(redFlag => {
    const id = `${redFlag.id}`;
    const chainId = `${redFlag.chain_id}`;
    const chainName = `${redFlag.chains?.chain_name}`;
    const redFlagType =
      codes.find(
        code =>
          code.table_name === 'red_flags' &&
          code.table_column === 'red_flag_type' &&
          code.value === (redFlag.red_flag_type ? parseInt(redFlag.red_flag_type) : null)
      )?.meaning ?? '';
    const createdTimestamp = redFlag.created_timestamp ?? 0;

    return {
      id,
      chainId,
      chainName,
      redFlagType,
      createdTimestamp,
    };
  });

  const result: ResponseData = redFlagsData;

  prisma.$disconnect();
  res.status(200).json(result);

  /*
  const result: ResponseData = [
    {
      "id": "1223724980",
      "chainId": "eth",
      "chainName": "Ethereum",
      "redFlagType": "RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_TRANSFER",
      "createdTimestamp": 1677769870
    },
    {
      "id": "1132480029",
      "chainId": "btc",
      "chainName": "Bitcoin",
      "redFlagType": "RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW",
      "createdTimestamp": 1682172429
    },
    {
      "id": "1468697785",
      "chainId": "usdt",
      "chainName": "Tether",
      "redFlagType": "RED_FLAG_DETAIL_PAGE.FLAG_TYPE_GAMBLING_SITE",
      "createdTimestamp": 1686548904
    },
    {
      "id": "1378976701",
      "chainId": "isun",
      "chainName": "iSunCloud",
      "redFlagType": "RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_DEPOSIT",
      "createdTimestamp": 1690657412
    }
    // ... other red flags
  ];
  res.status(200).json(result);
  */
}
