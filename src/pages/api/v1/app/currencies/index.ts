// 017 - GET /app/currencies

import type {NextApiRequest, NextApiResponse} from 'next';
import {ICurrencyListPage} from '../../../../../interfaces/currency';
import prisma from '../../../../../../prisma/client';
import {ITEM_PER_PAGE} from '../../../../../constants/config';

type ResponseData = ICurrencyListPage;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240308 - Liz) query string parameter
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;

  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : undefined;
  const type = typeof req.query.type === 'string' ? req.query.type : undefined; // Info: (20240308 - Liz) type is categorized by currency name

  // Info: (20240307 - Liz) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // Info: (20240307 - Liz) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // Info: (20240307 - Liz) 取幾筆

  // Info: (20240308 - Liz) 排序
  const sorting = sort === '' || sort === 'desc' ? 'desc' : 'asc';

  try {
    // Info: (20240201 - Julian) 從 DB 撈出所有 currencies 的資料
    const currencies = await prisma.currencies.findMany({
      where: {
        name: {
          startsWith: type,
          contains: search,
          mode: 'insensitive', // Info: (20240308 - Liz) 不分大小寫
        },
      },
      select: {
        id: true,
        risk_level: true,
        name: true,
      },
      orderBy: {
        name: sorting,
      },
      // Info: (20240307 - Liz) 分頁
      skip,
      take,
    });

    // Info: (20240308 - Liz) 取得總筆數
    const totalCurrencies = await prisma.currencies.count({
      where: {
        name: {
          startsWith: type,
          contains: search,
          mode: 'insensitive', // Info: (20240308 - Liz) 不分大小寫
        },
      },
    });

    // Info: (20240308 - Liz) 取得所有的 currency name 並去除重複
    const uniqueCurrencyTypes = await prisma.currencies.findMany({
      select: {
        name: true,
      },
      distinct: ['name'],
    });

    // Info: (20240308 - Liz) 用不重複的 currency name 做成下拉式選單的選項
    const currencyTypes = uniqueCurrencyTypes
      .map(currency => currency.name ?? '')
      .filter(currencyName => currencyName !== '')
      .sort((a, b) => (sorting === 'asc' ? a.localeCompare(b) : b.localeCompare(a)));

    // Info: (20240223 - Liz) 從 codes Table 撈出 risk_level 的 value 和 meaning 的對照表為一個物件陣列
    const riskLevelCodeMeaning = await prisma.codes.findMany({
      where: {
        table_name: 'currencies',
        table_column: 'risk_level',
      },
      select: {
        value: true,
        meaning: true,
      },
    });

    // Info: (20240223 - Liz) 遍歷物件陣列 轉換成物件 {value: meaning} 方便查找
    const riskLevelCodeMeaningObj: {
      [key: string]: string;
    } = {};
    riskLevelCodeMeaning.forEach(code => {
      riskLevelCodeMeaningObj[`${code.value}`] = code.meaning ?? 'Unknown Risk Level';
    });

    const currenciesData = currencies.map(currency => {
      // Info: (20240223 - Liz) 將資料庫傳來的 risk_level 轉換成對應的 meaning
      const riskLevel = currency.risk_level
        ? riskLevelCodeMeaningObj[currency.risk_level]
        : 'Unknown Risk Level';

      return {
        currencyId: currency.id,
        currencyName: `${currency.name}`,
        rank: 0, // ToDo: (20240125 - Julian) 討論去留
        riskLevel: riskLevel,
      };
    });

    // Info: (20240308 - Liz) 計算總頁數
    const totalPages = Math.ceil(totalCurrencies / ITEM_PER_PAGE);

    const result = {
      currencies: currenciesData,
      totalPages,
      currencyTypes, // Info: (20240308 - Liz) 下拉式選單選項
    };

    prisma.$connect();
    res.status(200).json(result);
  } catch (error) {
    // Info: (20240308 - Liz) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching currencies data (017):', error);
    res.status(500).json({} as ResponseData);
  }
}
