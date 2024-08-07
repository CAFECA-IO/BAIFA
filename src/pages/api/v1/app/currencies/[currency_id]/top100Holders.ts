// 028 - GET /app/currencies/:currency_id/top100Holders

import type {NextApiRequest, NextApiResponse} from 'next';
import {
  DEFAULT_PAGE,
  ITEM_PER_PAGE,
  TOP_100_HOLDER_MAX_AMOUNT,
} from '@/constants/config';
import {IHolder, ITop100Holders} from '@/interfaces/currency';
import prisma from '@/lib/utils/prisma';

type ResponseData = ITop100Holders;

// Info: (20240314 - Liz) 有搜尋條件的 holders 資料
const holderDataWithSearch = async (
  currency_id: number | undefined,
  search: string | undefined
) => {
  // Info: (20240314 - Liz) 先從資料庫取前 100 筆依照持有價值由大到小排序的資料
  const holderData100Top = await prisma.token_balances.findMany({
    where: {
      currency_id: currency_id,
      NOT: {
        value: {
          startsWith: '-', // Info: (20240318 - Liz) 不包含負數
        },
      },
    },
    select: {
      address: true,
      value: true,
    },
    orderBy: {
      value: 'desc', // Info: (20240314 - Liz) 依照持有價值由大到小排序
    },
    take: 100,
  });

  // Info: (20240314 - Liz) 再從這 100 筆資料中找出地址符合搜尋條件的資料
  const searchResult = holderData100Top.filter(holder => holder.address === search);

  return searchResult;
};

// Info: (20240314 - Liz) 無搜尋條件的 holders 資料(並且分頁)
const holderDataWithoutSearch = async (
  currency_id: number | undefined,
  take: number | undefined = 100,
  skip: number | undefined = 0
) => {
  const holderData100TopPaged = await prisma.token_balances.findMany({
    where: {
      currency_id: currency_id,
      NOT: {
        value: {
          startsWith: '-', // Info: (20240318 - Liz) 不包含負數
        },
      },
    },
    select: {
      address: true,
      value: true,
    },
    orderBy: {
      value: 'desc', // Info: (20240313 - Liz) 依照持有價值由大到小排序
    },
    // Info: (20240313 - Liz) 分頁
    take,
    skip,
  });

  return holderData100TopPaged;
};

// Info: (20240314 - Liz) 取得 holders 資料 (依照搜尋判斷)
const getHolders = async (
  currency_id: number | undefined,
  search: string | undefined,
  take: number | undefined = 100,
  skip: number | undefined = 0
) => {
  if (search) {
    return await holderDataWithSearch(currency_id, search);
  } else {
    return await holderDataWithoutSearch(currency_id, take, skip);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240312 - Liz) query string parameter
  const currency_id = 
    typeof req.query.currency_id === 'string' ? parseInt(req.query.currency_id) : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : DEFAULT_PAGE;
  const offset =
    typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : ITEM_PER_PAGE;
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : undefined;

  // Info: (20240319 - Liz) 計算分頁的 skip 與 take
  const skip = page > 0 ? (page - 1) * offset : 0; // Info: (20240319 - Liz) 跳過前面幾筆
  const take = offset; // Info: (20240319 - Liz) 取幾筆

  try {
    // Info: (20240312 - Liz) 從 currencies Table 中取得 total_amount 和 chain_id
    const currencyData = currency_id
      ? await prisma.currencies.findUnique({
          where: {
            id: currency_id,
          },
          select: {
            total_amount: true,
            chain_id: true,
            decimals: true,
          },
        })
      : null;

    // Info: (20240312 - Liz) currency 的總量
    const totalAmountOfCurrency = currencyData?.total_amount ?? '0';
    const decimal = currencyData?.decimals ?? 0;

    const holderData = await getHolders(currency_id, search, take, skip);

    // Info: (20240312 - Liz) 取得 holders 總筆數
    const totalHoldersAmount = await prisma.token_balances.count({
      where: {
        currency_id: currency_id,
      },
    });

    // Info: (20240312 - Liz) 計算總頁數，並且限制總頁數不超過 top100MaxPages 頁(超過 top100MaxPages 的頁數就會超過100筆資料)
    const totalPagesOfAllHolders = Math.ceil(totalHoldersAmount / offset);
    const top100MaxPages = Math.floor(TOP_100_HOLDER_MAX_AMOUNT / offset);
    const totalPages =
      totalPagesOfAllHolders > top100MaxPages ? top100MaxPages : totalPagesOfAllHolders;

    const holderDataFormat: IHolder[] = holderData.map(holder => {
      // Info: (20240220 - Liz) 取得持有價值 (資料庫欄位值設定為64位數字串前方補零)
      const holdingValue = holder.value ?? '0';

      // Info: (20240220 - Liz) 持有數量格式化(把價值轉換成數量): 切成兩部分，小數部分有(decimal)位數、整數部分另做處理
      const splitIndex = holdingValue.length - decimal;
      const firstPart = holdingValue.substring(0, splitIndex);
      const secondPart = holdingValue.substring(splitIndex);

      // Info: (20240313 - Liz) 去除整數部分前面的所有'0'(判斷整數部分是否為空字串，是就補一個'0')，每三位數加上千分位逗號
      const firstPartFormat = firstPart
        .replace(/^0*/, match => (match === '' ? '0' : ''))
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      const holdingAmount = `${firstPartFormat}.${secondPart}`;

      // Info: (20240318 - Liz) 計算持有比例
      function calculateHoldingPercentage(holdingValue: string, totalAmountOfCurrency: string) {
        const holdingValueBigInt = BigInt(holdingValue);
        const scale = BigInt(10000);
        const scaleHoldingValueBigInt = holdingValueBigInt * scale;
        const holdingPercentageBigInt = scaleHoldingValueBigInt / BigInt(totalAmountOfCurrency);
        const holdingPercentageString = holdingPercentageBigInt.toString();

        // Info: (20240220 - Liz) 將持有比例格式化為小數點後2位小數(原本scale 10000倍，這裡只有縮小100倍是因為要直接換算成百分比)
        const formatString = (str: string) => {
          const paddedA = str.padStart(3, '0'); // Info: (20240220 - Liz) 字串前面補零，直到長度為3，原長度大於或等於3時不會補零
          const integerPart = paddedA.slice(0, -2); // Info: (20240220 - Liz) 整數部分
          const decimalPart = paddedA.slice(-2); // Info: (20240220 - Liz) 小數部分
          return `${integerPart}.${decimalPart}`;
        };

        return formatString(holdingPercentageString);
      }

      const holdingPercentage = calculateHoldingPercentage(holdingValue, totalAmountOfCurrency);

      // Info: (20240202 - Julian) 計算持有比例的 bar 寬度
      const holdingBarWidth = Number(holdingPercentage);

      return {
        addressId: `${holder.address}`,
        holdingAmount: holdingAmount,
        holdingPercentage: holdingPercentage,
        holdingBarWidth: holdingBarWidth,
        publicTag: ['Unknown User'], // ToDo: (20240130 - Julian) 待補上
      };
    });

    const result = {
      holdersData: holderDataFormat,
      totalPages: search ? 1 : totalPages, // Info: (20240314 - Liz) 搜尋存在的話，這裡會只找到一筆資料，所以總頁數設定 1
    };

    prisma.$connect();
    res.status(200).json(result);
  } catch (error) {
    // Info: (20240312 - Liz) Request error
    // eslint-disable-next-line no-console
    console.error('Error in fetching top 100 holders data (028):', error);
    res.status(500).json({} as ResponseData);
  }
}

/* ---------- Mock API ---------- */
// export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
//   const result = {
//     'holdersData': [
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       {
//         'addressId': '0xd26b3236c4f4e6df16b41eecf18a1c573abdb75e',
//         'holdingAmount': '19.999903801999551076',
//         'holdingPercentage': '0.00',
//         'holdingBarWidth': 0,
//         'publicTag': ['Unknown User'],
//       },
//       // ... other top 100 holders
//     ],
//     'totalPages': 2,
//   };
//   return res.status(200).json(result);
// }
