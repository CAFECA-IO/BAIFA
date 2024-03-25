// 021 - GET /app/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../prisma/client';
import {IRedFlagPage} from '../../../../../interfaces/red_flag';
import {ITEM_PER_PAGE} from '../../../../../constants/config';

type ResponseData = IRedFlagPage;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240307 - Liz) query string parameter
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const search = typeof req.query.search === 'string' ? parseInt(req.query.search, 10) : undefined;
  const flag = (req.query.flag as string) === '' ? undefined : (req.query.flag as string);

  // Info: (20240307 - Liz) 將 req 傳來的日期字串轉換成數字或 undefined
  const parseDate = (dateString: string | string[] | undefined) => {
    if (typeof dateString === 'string') {
      const parsedDate = parseInt(dateString, 10);
      return !isNaN(parsedDate) && parsedDate > 0 ? parsedDate : undefined;
    }
    return undefined;
  };
  const startDate = parseDate(req.query.start_date);
  const endDate = parseDate(req.query.end_date);

  // Info: (20240307 - Liz) 計算分頁的 skip 與 take
  const skip = (page - 1) * ITEM_PER_PAGE; // Info: (20240307 - Liz) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // Info: (20240307 - Liz) 取幾筆

  try {
    // Info:(20240118 - Liz) 從 red_flags Table 中取得資料，並做條件篩選以及分頁
    const redFlags = await prisma.red_flags.findMany({
      where: {
        red_flag_type: flag, // Info: (20240307 - Liz) 篩選 red_flag_type
        id: search ? {equals: search} : undefined, // Info: (20240307 - Liz) 篩選 id
        created_timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
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
      orderBy: [
        {
          created_timestamp: sort, // Info: (20240307 - Liz) 1. created_timestamp 由 sort 決定排序
        },
        {
          id: sort, // Info: (20240315 - Liz) 2. id 由 sort 決定排序
        },
      ],
      // Info: (20240307 - Liz) 分頁
      skip,
      take,
    });

    // Info: (20240307 - Liz) 取得 red flag 總筆數
    const totalRedFlagCount = await prisma.red_flags.count({
      where: {
        red_flag_type: flag, // Info: (20240307 - Liz) 篩選 red_flag_type
        id: search ? {equals: search} : undefined, // Info: (20240307 - Liz) 篩選 id
        created_timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Info: (20240205 - Liz) 從 codes Table 撈出 red_flag_type 的 value 和 meaning 的對照表為一個物件陣列
    const redFlagTypeCodeMeaning = await prisma.codes.findMany({
      where: {
        table_name: 'red_flags',
        table_column: 'red_flag_type',
      },
      select: {
        value: true,
        meaning: true,
      },
    });

    // Info: (20240307 - Liz) 遍歷物件陣列 轉換成物件 {value: meaning} 方便查找
    const redFlagTypeCodeMeaningObj: {[key: string]: string} = {};
    redFlagTypeCodeMeaning.forEach(code => {
      const codeValue = typeof code.value === 'number' ? `${code.value}` : '';
      redFlagTypeCodeMeaningObj[codeValue] = code.meaning ?? '';
    });

    // Info:(20240118 - Liz) 組合回傳資料
    const redFlagsData = redFlags.map(redFlag => {
      const id = `${redFlag.id}`;
      const chainId = `${redFlag.chain_id}`;
      const chainName = `${redFlag.chains?.chain_name}`;
      const redFlagType = redFlag.red_flag_type
        ? redFlagTypeCodeMeaningObj[redFlag.red_flag_type]
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

    // Info: (20240307 - Liz) 計算總頁數
    const totalPages = Math.ceil(totalRedFlagCount / ITEM_PER_PAGE);

    const result: ResponseData = {
      redFlagData: redFlagsData,
      totalPages,
    };

    prisma.$disconnect();
    res.status(200).json(result);
  } catch (error) {
    // Info: (20240307 - Liz) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching red flags data (021):', error);
    res.status(500).json({} as ResponseData);
  }
}
