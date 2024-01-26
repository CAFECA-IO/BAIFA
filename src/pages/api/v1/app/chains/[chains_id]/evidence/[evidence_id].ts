// 016 - GET /app/chains/:chain_id/evidence/:evidence_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../lib/utils/prismaUtils';

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type TransactionData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  from: AddressInfo[];
  to: AddressInfo[];
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type ResponseData = {
  id: string;
  chainId: string;
  chainIcon: string;
  evidenceAddress: string;
  state: 'Active' | 'Inactive';
  creatorAddressId: string;
  createdTimestamp: number;
  content: string;
  transactionHistoryData: TransactionData[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const evidenceId = typeof req.query.evidence_id === 'string' ? req.query.evidence_id : undefined;

  const evidenceData = await prisma.evidences.findUnique({
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

  // Info: (20240126 - Julian) 取得 chain_icon
  const chainData = await prisma.chains.findUnique({
    where: {
      id: evidenceData?.chain_id,
    },
    select: {
      chain_icon: true,
    },
  });
  const chainIcon = chainData?.chain_icon ?? '';

  const result: ResponseData = evidenceData
    ? {
        id: `${evidenceData.id}`,
        chainId: `${evidenceData.chain_id}`,
        chainIcon: chainIcon,
        evidenceAddress: evidenceData.evidence_id,
        state: 'Active', // Info: (20240118 - Julian) 需要參考 codes Table 並補上 state 的轉換
        creatorAddressId: `${evidenceData.creator_address}`,
        createdTimestamp: evidenceData.created_timestamp.getTime() / 1000,
        content: evidenceData.content, // ToDo: (20240119 - Julian) 這裡應該會是 JSON 格式
        transactionHistoryData: [], // ToDo: (20240118 - Julian) 補上這個欄位
      }
    : {
        id: '',
        chainId: '',
        chainIcon: '',
        evidenceAddress: '',
        state: 'Inactive',
        creatorAddressId: '',
        createdTimestamp: 0,
        content: '',
        transactionHistoryData: [],
      };

  res.status(200).json(result);
}
