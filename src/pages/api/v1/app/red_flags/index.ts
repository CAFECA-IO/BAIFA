// 021 - GET /app/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../prisma/client';
import {IRedFlagPage} from '../../../../../interfaces/red_flag';
import {ITEM_PER_PAGE} from '../../../../../constants/config';

type ResponseData = IRedFlagPage | string;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240307 - Liz) query string
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  const search = typeof req.query.search === 'string' ? parseInt(req.query.search) : undefined;
  const flag = typeof req.query.flag === 'string' ? req.query.flag : undefined;

  const parseDate = (dateString: string | string[] | undefined) => {
    if (typeof dateString === 'string') {
      const parsedDate = parseInt(dateString, 10);
      return !isNaN(parsedDate) && parsedDate > 0 ? parsedDate : undefined;
    }
    return undefined;
  };
  // Info: (20240307 - Liz) 將 req 傳來的日期字串轉換成數字或 undefined
  const startDate = parseDate(req.query.start_date);
  const endDate = parseDate(req.query.end_date);

  // Info: (20240307 - Liz) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // Info: (20240307 - Liz) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // Info: (20240307 - Liz) 取幾筆

  // Info: (20240307 - Liz) 排序
  const sorting = sort === 'SORTING.OLDEST' ? 'asc' : 'desc';

  // Info: (20240307 - Liz) flag name 篩選，如果是空字串就搜尋全部
  const redFlagType = flag === '' ? undefined : flag;

  try {
    // Info:(20240118 - Liz) 從 red_flags Table 中取得資料，並做條件篩選以及分頁
    const redFlags = await prisma.red_flags.findMany({
      where: {
        red_flag_type: redFlagType, // Info: (20240307 - Liz) 篩選 red_flag_type
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
          created_timestamp: sorting, // Info: (20240307 - Liz) 1. created_timestamp 由 sorting 決定排序
        },
        {
          id: 'asc', // Info: (20240307 - Liz) 2. id 由小到大排序
        },
      ],
      // Info: (20240307 - Liz) 分頁
      skip,
      take,
    });

    // Info: (20240307 - Liz) 取得 red flag 總筆數
    const totalRedFlagCount = await prisma.red_flags.count({
      where: {
        red_flag_type: redFlagType, // Info: (20240307 - Liz) 篩選 red_flag_type
        id: search ? {equals: search} : undefined, // Info: (20240307 - Liz) 篩選 id
        created_timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Info: (20240205 - Liz) 若查無 redFlags 資料，回傳 404
    if (redFlags === null) {
      res.status(404).send('404 - redFlagData Not Found');
      return;
    }

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

    // Info: (20240307 - Liz) 取得所有的 red Flag Type 並去除重複
    const uniqueRedFlagTypes = await prisma.red_flags.findMany({
      select: {
        red_flag_type: true,
      },
      distinct: ['red_flag_type'],
    });

    // Info: (20240307 - Liz)  用不重複的 red Flag Type 做成下拉式選單的選項
    const allRedFlagTypes = uniqueRedFlagTypes.map(redFlagType => {
      return redFlagTypeCodeMeaningObj[`${redFlagType.red_flag_type}`];
    });

    // Info:(20240118 - Liz) 將撈出來的資料轉換成 API 要的格式
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
      allRedFlagTypes: allRedFlagTypes,
      redFlagTypeCodeMeaningObj,
    };

    prisma.$disconnect();
    res.status(200).json(result);
  } catch (error) {
    // Info: (20240307 - Liz) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching red flag data:', error);
    res.status(500).json('500 - Internal Server Error');
  }
}
