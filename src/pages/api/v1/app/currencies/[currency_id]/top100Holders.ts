// 028 - GET /app/currencies/:currency_id/top100Holders

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../prisma/client';
import {IHolder, ITop100Holders} from '../../../../../../interfaces/currency';
import {ITEM_PER_PAGE, TOP_100_HOLDER_MAX_TOTAL_PAGES} from '../../../../../../constants/config';

type ResponseData = ITop100Holders;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240312 - Liz) query string parameter
  const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : undefined;

  // Info: (20240312 - Liz) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // Info: (20240306 - Liz) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // Info: (20240306 - Liz) 取幾筆

  try {
    // Info: (20240312 - Liz) 從 currencies Table 中取得 total_amount 和 chain_id
    const currencyData = await prisma.currencies.findUnique({
      where: {
        id: currency_id,
      },
      select: {
        total_amount: true,
        chain_id: true,
      },
    });

    // Info: (20240312 - Liz) currency 的總量
    const totalAmountOfCurrency = currencyData?.total_amount ?? '0';

    // Info: (20240312 - Liz) 從 chains Table 中取得 unit 和 decimal
    const chainId = currencyData?.chain_id;
    const decimalsOfChain = await prisma.chains.findUnique({
      where: {
        id: chainId ?? undefined,
      },
      select: {
        decimals: true,
      },
    });
    const decimal = decimalsOfChain?.decimals ?? 0;

    // Info: (20240312 - Liz) 從 token_balances Table 中取得 holders，並做條件篩選以及分頁
    const holderData = await prisma.token_balances.findMany({
      where: {
        currency_id: currency_id,
        address: search ? {contains: search} : undefined, // Info: (20240312 - Liz) 搜尋條件
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

    // Info: (20240312 - Liz) 取得 holders 總筆數
    const totalHoldersAmount = await prisma.token_balances.count({
      where: {
        currency_id: currency_id,
      },
    });

    // Info: (20240312 - Liz)  計算總頁數，並且限制總頁數不超過 10 頁(超過10頁就會超過100筆)
    const totalPagesOfAllHolders = Math.ceil(totalHoldersAmount / ITEM_PER_PAGE);
    const totalPages =
      totalPagesOfAllHolders > TOP_100_HOLDER_MAX_TOTAL_PAGES
        ? TOP_100_HOLDER_MAX_TOTAL_PAGES
        : totalPagesOfAllHolders;

    const holderDataFormat: IHolder[] = holderData.map(holder => {
      // Info: (20240220 - Liz) 取得持有價值(資料庫會處理將此欄位64位數不足字串開頭補零)
      const holdingValue = holder.value ?? '0';

      // Info: (20240220 - Liz) 持有數量格式化(把價值轉換成數量): 切成兩部分，小數部分有(decimal) 18 位數、整數部分加上千分位逗號
      const splitIndex = holdingValue.length - decimal;
      const firstPart = holdingValue.substring(0, splitIndex);
      const secondPart = holdingValue.substring(splitIndex);
      // Info: (20240313 - Liz) 去除整數部分前面的所有 '0' 並且加上千分位逗號
      const firstPartFormat = firstPart.replace(/^0+/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      const holdingAmount = `${firstPartFormat}.${secondPart}`;

      // Info: (20240220 - Liz) 計算持有比例
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
      const holdingPercentage = formatString(holdingPercentageString);

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
      totalPages: totalPages,
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
