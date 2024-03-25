// 019 - GET /app/currencies/:currency_id/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../prisma/client';
import {IRedFlagListForCurrency} from '../../../../../../interfaces/red_flag';
import {ITEM_PER_PAGE} from '../../../../../../constants/config';

type ResponseData = IRedFlagListForCurrency;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240319 - Liz) query string parameter
  const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : undefined;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const search = typeof req.query.search === 'string' ? parseInt(req.query.search, 10) : undefined;
  const flag = (req.query.flag as string) === '' ? undefined : (req.query.flag as string);

  // Info: (20240319 - Liz) 將 req 傳來的日期字串轉換成數字或 undefined
  const parseDate = (dateString: string | string[] | undefined) => {
    if (typeof dateString === 'string') {
      const parsedDate = parseInt(dateString, 10);
      return !isNaN(parsedDate) && parsedDate > 0 ? parsedDate : undefined;
    }
    return undefined;
  };
  const startDate = parseDate(req.query.start_date);
  const endDate = parseDate(req.query.end_date);

  // Info: (20240319 - Liz) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // Info: (20240319 - Liz) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // Info: (20240319 - Liz) 取幾筆

  try {
    // Info: (20240227 - Liz) 從 red_flags Table 中取得資料，並做條件篩選以及分頁
    const redFlagData = await prisma.red_flags.findMany({
      where: {
        currency_id: currency_id,
        red_flag_type: flag,
        id: search ? {equals: search} : undefined,
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
          created_timestamp: sort, // Info: (20240319 - Liz) 1. created_timestamp 由 sort 決定排序
        },
        {
          id: sort, // Info: (20240319 - Liz) 2. id 由 sort 決定排序
        },
      ],
      // Info: (20240319 - Liz) 分頁
      skip,
      take,
    });

    // Info: (20240319 - Liz) 取得 red flag 總筆數
    const totalRedFlagCount = await prisma.red_flags.count({
      where: {
        currency_id: currency_id,
        red_flag_type: flag,
        id: search ? {equals: search} : undefined,
        created_timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Info: (20240227 - Liz) 從 codes table 撈出 red_flag_type 的 value 和 meaning 為一個物件陣列
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

    // Info: (20240227 - Liz) 遍歷物件陣列 轉換成物件 {value: meaning} 方便查找
    const redFlagTypeCodeMeaningObj: {[key: string]: string} = {};
    redFlagTypeCodeMeaning.forEach(code => {
      const codeValue = typeof code.value === 'number' ? `${code.value}` : '';
      redFlagTypeCodeMeaningObj[codeValue] = code.meaning ?? '';
    });

    // Info: (20240325 - Liz) 組合 redFlagData 的回傳格式
    const redFlagDataFormat = redFlagData.map(redFlag => {
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

    // Info: (20240319 - Liz) 由 currency id 找到 chain id，再由 chain id 找到 chain name
    const chainIdRaw = currency_id
      ? await prisma.currencies.findUnique({
          where: {
            id: currency_id,
          },
          select: {
            chain_id: true,
          },
        })
      : null;
    const chainId = chainIdRaw?.chain_id ?? undefined;

    const chainNameRaw = chainId
      ? await prisma.chains.findUnique({
          where: {
            id: chainId,
          },
          select: {
            chain_name: true,
          },
        })
      : null;
    const chainName = chainNameRaw?.chain_name ?? 'Unknown Chain Name';

    // Info: (20240307 - Liz) 計算總頁數
    const totalPages = Math.ceil(totalRedFlagCount / ITEM_PER_PAGE);

    // Info: (20240227 - Liz) 組合回傳資料
    const result: ResponseData = {
      redFlagData: redFlagDataFormat,
      chainName,
      totalPages,
    };

    prisma.$connect();
    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error fetching red flags data from a currency (019):', error);
    res.status(500).json({} as ResponseData);
  }
}

/* Mock API */
// export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
//   const result = {
//     'redFlagData': [
//       {
//         'id': '4',
//         'chainId': '8017',
//         'chainName': 'iSunCoin',
//         'redFlagType': 'With Gambling Site',
//         'createdTimestamp': 1708568924,
//       },
//       {
//         'id': '2',
//         'chainId': '8017',
//         'chainName': 'iSunCoin',
//         'redFlagType': 'With Mixing Service',
//         'createdTimestamp': 1708368924,
//       },
//       {
//         'id': '1',
//         'chainId': '8017',
//         'chainName': 'iSunCoin',
//         'redFlagType': 'Multiple Receives',
//         'createdTimestamp': 1707954536,
//       },
//       // ... other red flags
//     ],
//     'totalPages': 1,
//     'redFlagTypes': ['With Gambling Site', 'With Mixing Service', 'Multiple Receives'],
//     'redFlagTypeCodeMeaningObj': {
//       '0': 'Multiple Transfer',
//       '1': 'Multiple Receives',
//       '2': 'Large Deposit',
//       '3': 'With Mixing Service',
//       '4': 'Multiple Withdraw',
//       '5': 'With Gambling Site',
//       '6': 'Large Withdraw',
//       '7': 'With Black List',
//       '8': 'With Darknet',
//       '9': 'Large Transfer',
//     },
//   };
//   res.status(200).json(result);
// }
