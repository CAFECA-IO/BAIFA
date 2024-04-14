// 016 - GET /app/chains/:chain_id/evidence/:evidence_id

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../../../prisma/client';
import {IEvidenceBrief} from '../../../../../../../../interfaces/evidence';

type ResponseData = IEvidenceBrief | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const evidenceId = typeof req.query.evidence_id === 'string' ? req.query.evidence_id : undefined;

  try {
    const evidenceData = await prisma.evidences.findFirst({
      where: {
        evidence_id: evidenceId,
      },
      select: {
        id: true,
        evidence_id: true,
        chain_id: true,
        state: true,
        creator_address: true,
        created_timestamp: true,
        //content: true,
      },
    });

    // Info: (20240205 - Julian) 從 codes Table 撈出 evidences state
    const evidenceCodes = await prisma.codes.findMany({
      where: {
        table_name: 'evidences',
      },
      select: {
        table_column: true,
        value: true,
        meaning: true,
      },
    });

    // Info: (20240205 - Julian) 轉換 state
    const state =
      evidenceCodes
        // Info: (20240205 - Julian) 先過濾出 state
        .filter(code => code.table_column === 'state')
        // Info: (20240205 - Julian) 再找出對應的 meaning；由於 state 是數字，所以要先轉換成數字再比對
        .find(code => code.value === parseInt(evidenceData?.state ?? ''))?.meaning ?? '';

    const result: ResponseData = evidenceData
      ? {
          id: `${evidenceData.id}`,
          chainId: `${evidenceData.chain_id}`,
          evidenceAddress: `${evidenceData.evidence_id}`,
          state: state,
          creatorAddressId: `${evidenceData.creator_address}`,
          createdTimestamp: evidenceData.created_timestamp ?? 0,
          // ToDo: (20240219 - Julian) content 應該是 json 格式，後續要再處理
          //content: `${evidenceData.content}`,
        }
      : // Info: (20240130 - Julian) 如果沒有找到資料，就回傳 undefined
        undefined;

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get evidence data:', error);
    res.status(500).json(undefined);
  } finally {
    await prisma.$disconnect();
  }
}
