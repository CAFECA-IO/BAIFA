// 034 - GET /app/red_flags/menu_options

import type {NextApiRequest, NextApiResponse} from 'next';
import {IMenuOptions} from '@/interfaces/red_flag';
import prisma from '@/lib/utils/prisma';

type ResponseData = IMenuOptions;

export default async function handler(eq: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
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

    const result: ResponseData = {
      options: allRedFlagTypes,
      redFlagTypeCodeMeaningObj: redFlagTypeCodeMeaningObj,
    };

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240325 - Liz) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching red flags menu options (034):', error);
    res.status(500).json({options: [], redFlagTypeCodeMeaningObj: {}});
  } finally {
    await prisma.$disconnect();
  }
}
