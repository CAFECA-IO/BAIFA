// 018 - GET /app/currencies/:currency_id

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../prisma/client';
import {ICurrencyDetailString} from '../../../../../../interfaces/currency';
import {IRedFlag} from '../../../../../../interfaces/red_flag';

type ResponseData = ICurrencyDetailString;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) query string parameter
  const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;

  try {
    const currencyData = await prisma.currencies.findUnique({
      where: {
        id: currency_id,
      },
      select: {
        id: true,
        name: true,
        holder_count: true,
        price: true,
        volume_in_24h: true,
        total_transfers: true,
        total_amount: true,
        risk_level: true,
        chain_id: true,
      },
    });

    // Info: (20240125 - Julian) 從 chains Table 中取得 unit 和 decimal
    const chainId = currencyData?.chain_id;
    const chainData = await prisma.chains.findUnique({
      where: {
        id: chainId ?? undefined,
      },
      select: {
        symbol: true,
        decimals: true,
      },
    });
    const unit = chainData?.symbol ?? '';
    const decimal = chainData?.decimals ?? 0;

    // Info: (20240125 - Julian) currency 的 24 小時交易量
    const volumeIn24hRaw = parseInt(`${currencyData?.volume_in_24h ?? 0}`);
    const volumeIn24h = volumeIn24hRaw / Math.pow(10, decimal);

    // Info: (20240125 - Julian) currency 的總量
    const totalAmountRaw = currencyData?.total_amount ?? '0';

    // Info: (20240219 - Liz) currency 總量小數後未滿18位數自動補零
    const totalAmountRawFilled = totalAmountRaw.padStart(19, '0');

    // Info: (20240219 - Liz) 取得切割點後第一個索引
    const splitIndex = totalAmountRawFilled.length - decimal; // decimal = 18

    // Info: (20240219 - Liz) 切割字串兩部分：整數部分和小數部分
    const firstPart = totalAmountRawFilled.substring(0, splitIndex);
    const secondPart = totalAmountRawFilled.substring(splitIndex);

    // Info: (20240219 - Liz) 整數部分每三位數一個逗號
    const firstPartWithComma = firstPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Info: (20240219 - Liz) 組合字串
    const totalAmount = `${firstPartWithComma}.${secondPart}`;

    // Info: (20240125 - Julian) 從 red_flags Table 中取得資料
    const flaggingData = await prisma.red_flags.findMany({
      select: {
        id: true,
        chain_id: true,
        red_flag_type: true,
        created_timestamp: true,
      },
    });
    const flagging: IRedFlag[] = flaggingData.map(flag => {
      return {
        id: `${flag.id}`,
        chainId: `${flag.chain_id}`,
        redFlagType: `${flag.red_flag_type}`,
        createdTimestamp: flag.created_timestamp ?? 0,
      };
    });
    // Deprecated: (今天 - Liz)
    // eslint-disable-next-line no-console
    console.log('flagging:', flagging);

    // Info: (20240222 - Liz) 從 codes Table 撈出 risk_level 的 value 和 meaning 的對照表為一個物件陣列
    const riskLevelCodes = await prisma.codes.findMany({
      where: {
        table_name: 'currencies',
        table_column: 'risk_level',
      },
      select: {
        value: true,
        meaning: true,
      },
    });

    // Info: (20240222 - Liz) 遍歷物件陣列 轉換成物件
    const riskLevelCodesObj: {
      [key: string]: string;
    } = {};
    riskLevelCodes.forEach(item => {
      if (item.value && item.meaning) {
        riskLevelCodesObj[item.value] = item.meaning;
      }
    });

    // Info: (20240222 - Liz) 將資料庫傳來的 risk_level 轉換成對應的 meaning
    const riskLevel = currencyData?.risk_level
      ? riskLevelCodesObj[currencyData.risk_level]
      : 'Unknown Risk Level';

    // Info: (20240221 - Liz) 組合回傳資料並轉換成 API 要的格式
    const result: ResponseData = {
      currencyId: `${currencyData?.id}`,
      currencyName: `${currencyData?.name}`,
      chainId: `${chainId}`,
      rank: 0, // ToDo: (20240125 - Julian) 討論去留
      holderCount: currencyData?.holder_count ?? 0,
      price: currencyData?.price ?? 0,
      volumeIn24h: volumeIn24h,
      unit: unit,
      totalAmount: totalAmount,
      totalTransfers: currencyData?.total_transfers ?? 0,
      flagging: flagging,
      flaggingCount: flagging.length,
      riskLevel: riskLevel,
    };

    prisma.$connect();
    res.status(200).json(result);
  } catch (error) {
    // Info: (20240312 - Liz) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching blacklist data (018):', error);
    res.status(500).json({} as ResponseData);
  }
}

/* ---------- Mock API ---------- */
// export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
//   const result = {
//     'currencyId': '0x0000000000000000000000000000000000000000',
//     'currencyName': 'iSunCoin',
//     'chainId': '8017',
//     'rank': 0,
//     'holderCount': 0,
//     'price': 0,
//     'volumeIn24h': 0,
//     'unit': 'ISC',
//     'totalAmount': '605,414.000000000000000000',
//     'totalTransfers': 16,
//     'flagging': [],
//     'flaggingCount': 0,
//     'riskLevel': 'Normal',
//   };
//   return res.status(200).json(result);
// }
