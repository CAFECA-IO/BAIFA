// 019 - GET /app/currencies/:currency_id/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../prisma/client';
import {IRedFlagListForCurrency} from '../../../../../../interfaces/red_flag';

type ResponseData = IRedFlagListForCurrency;

// export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
//   // Info: (20240129 - Julian) query string parameter
//   const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;

//   try {
//     // Info: (20240129 - Julian) 取得 currency 資料
//     const currencyData = await prisma.currencies.findUnique({
//       where: {
//         id: currency_id,
//       },
//       select: {
//         name: true,
//         chain_id: true,
//       },
//     });

//     // Info: (20240227 - Liz) 根據 currency_id 取得 red_flags 資料
//     const redFlagData = currency_id
//       ? await prisma.red_flags.findMany({
//           where: {
//             currency_id: currency_id,
//           },
//           select: {
//             id: true,
//             chain_id: true,
//             red_flag_type: true,
//             created_timestamp: true,
//           },
//         })
//       : [];

//     // Info: (20240227 - Liz) 從 codes table 撈出 red_flag_type 的 value 和 meaning 為一個物件陣列
//     const redFlagTypeCodes = await prisma.codes.findMany({
//       where: {
//         table_name: 'red_flags',
//         table_column: 'red_flag_type',
//       },
//       select: {
//         value: true,
//         meaning: true,
//       },
//     });

//     // Info: (20240227 - Liz) 遍歷物件陣列 轉換成物件
//     const redFlagTypeCodesObj: {[key: string]: string} = {};
//     redFlagTypeCodes.forEach(item => {
//       if (item.value && item.meaning) {
//         redFlagTypeCodesObj[item.value] = item.meaning;
//       }
//     });

//     // Info: (20240227 - Liz) 組合回傳資料
//     const result: ResponseData = redFlagData.map(redFlag => {
//       // Info: (20240227 - Liz) 將資料庫傳來的 red_flag_type 轉換成對應的 meaning
//       const redFlagType = redFlag.red_flag_type
//         ? redFlagTypeCodesObj[redFlag.red_flag_type]
//         : 'Unknown Red Flag Type';

//       return {
//         id: `${redFlag.id}`,
//         chainId: `${redFlag.chain_id}`,
//         chainName: `${currencyData?.name}`,
//         redFlagType: redFlagType,
//         createdTimestamp: redFlag.created_timestamp ?? 0,
//       };
//     });

//     prisma.$connect();
//     res.status(200).json(result);
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.log('Error fetching red flags data from a currency (019):', error);
//     res.status(500).json([] as ResponseData);
//   }
// }

/* Mock API */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result = {
    'redFlagData': [
      {
        'id': '4',
        'chainId': '8017',
        'chainName': 'iSunCoin',
        'redFlagType': 'With Gambling Site',
        'createdTimestamp': 1708568924,
      },
      {
        'id': '2',
        'chainId': '8017',
        'chainName': 'iSunCoin',
        'redFlagType': 'With Mixing Service',
        'createdTimestamp': 1708368924,
      },
      {
        'id': '1',
        'chainId': '8017',
        'chainName': 'iSunCoin',
        'redFlagType': 'Multiple Receives',
        'createdTimestamp': 1707954536,
      },
      // ... other red flags
    ],
    'totalPages': 1,
    'redFlagTypes': ['With Gambling Site', 'With Mixing Service', 'Multiple Receives'],
    'redFlagTypeCodeMeaningObj': {
      '0': 'Multiple Transfer',
      '1': 'Multiple Receives',
      '2': 'Large Deposit',
      '3': 'With Mixing Service',
      '4': 'Multiple Withdraw',
      '5': 'With Gambling Site',
      '6': 'Large Withdraw',
      '7': 'With Black List',
      '8': 'With Darknet',
      '9': 'Large Transfer',
    },
  };
  res.status(200).json(result);
}
