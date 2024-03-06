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

  // Info: (20240205 - Liz) 從 codes Table 撈出 red_flag_type 的 value 和 meaning 的對照表為一個物件陣列
  const redFlagTypeCodes = await prisma.codes.findMany({
    where: {
      table_name: 'red_flags',
      table_column: 'red_flag_type',
    },
    select: {
      value: true,
      meaning: true,
    },
  });

  // Info: (今天 - Liz) 遍歷物件陣列 轉換成物件
  const redFlagTypeCodesObj: {[key: string]: string} = {};
  redFlagTypeCodes.forEach(code => {
    const codeValue = code.value ? `${code.value}` : '';
    redFlagTypeCodesObj[codeValue] = code.meaning ?? '';
  });

  // Info:(20240118 - Liz) 將撈出來的資料轉換成 API 要的格式
  const redFlagsData = redFlags.map(redFlag => {
    const id = `${redFlag.id}`;
    const chainId = `${redFlag.chain_id}`;
    const chainName = `${redFlag.chains?.chain_name}`;
    const redFlagType = redFlag.red_flag_type
      ? redFlagTypeCodesObj[redFlag.red_flag_type]
      : 'Unknown Red Flag Type';
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
}
