// 016 - GET /app/chains/:chain_id/evidence/:evidence_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../lib/utils/prismaUtils';
import {IEvidenceDetail} from '../../../../../../../interfaces/evidence';
import {FAILED_TRANSACTION_STATUS_CODE} from '../../../../../../../constants/config';

type ResponseData = IEvidenceDetail | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const evidenceId = typeof req.query.evidence_id === 'string' ? req.query.evidence_id : undefined;

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
      content: true,
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

  // Info: (20240205 - Julian) 從 codes Table 撈出 transaction type 和 status
  const transactionCodes = await prisma.codes.findMany({
    where: {
      table_name: 'transactions',
    },
    select: {
      table_column: true,
      value: true,
      meaning: true,
    },
  });

  // Info: (20240205 - Julian) 轉換 status list
  const statusList = transactionCodes.filter(code => code.table_column === 'status');
  // Info: (20240205 - Julian) 轉換 type list
  const typeList = transactionCodes.filter(code => code.table_column === 'type');

  // Info: (20240205 - Julian) 撈出 transactions
  const transactions = await prisma.transactions.findMany({
    where: {
      evidence_id: evidenceId,
    },
    select: {
      id: true,
      chain_id: true,
      created_timestamp: true,
      type: true,
      status: true,
    },
  });

  const transactionHistoryData = transactions.map(transaction => {
    // Info: (20240205 - Julian) 找出對應的 type 和 status
    const status =
      statusList.find(code => code.value === parseInt(transaction.status ?? ''))?.meaning ?? '';
    const type =
      typeList.find(code => code.value === parseInt(transaction.type ?? ''))?.meaning ?? '';

    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transaction?.created_timestamp ?? 0,
      type: type,
      status: status,
    };
  });

  const result: ResponseData = evidenceData
    ? {
        id: `${evidenceData.id}`,
        chainId: `${evidenceData.chain_id}`,
        evidenceAddress: `${evidenceData.evidence_id}`,
        state: state,
        creatorAddressId: `${evidenceData.creator_address}`,
        createdTimestamp: evidenceData.created_timestamp ?? 0,
        transactionHistoryData: transactionHistoryData,
      }
    : // Info: (20240130 - Julian) 如果沒有找到資料，就回傳 undefined
      undefined;

  prisma.$connect();
  res.status(200).json(result);
}
