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
  const evidenceId =
    typeof req.query.evidence_id === 'string' ? parseInt(req.query.evidence_id) : undefined;

  const evidenceData = await prisma.evidences.findUnique({
    where: {
      id: evidenceId,
    },
    select: {
      id: true,
      //evidence_id: true,
      chain_id: true,
      state: true,
      creator_address: true,
      created_timestamp: true,
      content: true,
    },
  });

  console.log(evidenceData);

  const result: ResponseData = evidenceData
    ? {
        id: `${evidenceData.id}`,
        chainId: `${evidenceData.chain_id}`,
        evidenceAddress: '', //`${evidenceData.evidence_id}`,
        state: 'Active', // Info: (20240118 - Julian) 需要參考 codes Table 並補上 state 的轉換
        creatorAddressId: `${evidenceData.creator_address}`,
        createdTimestamp: evidenceData.created_timestamp.getTime() / 1000,
        content: evidenceData.content,
        transactionHistoryData: [], // ToDo: (20240118 - Julian) 補上這個欄位
      }
    : {
        id: '',
        chainId: '',
        evidenceAddress: '',
        state: 'Inactive',
        creatorAddressId: '',
        createdTimestamp: 0,
        content: '',
        transactionHistoryData: [],
      };

  res.status(200).json(result);

  /* 
  const result: ResponseData = {
    'id': '510071',
    'chainId': 'btc',
    'evidenceAddress': '0x2326ce42a513a427a1ab5045a684e0a8ee8e96a13',
    'state': 'Active',
    'creatorAddressId': '114007',
    'createdTimestamp': 1687103913,
    'content': '',
    'transactionHistoryData': [
      {
        'id': '915024',
        'chainId': 'btc',
        'createdTimestamp': 1682817342,
        'from': [
          {'type': 'address', 'address': '114007'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'to': [
          {'type': 'contract', 'address': '311382'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'status': 'SUCCESS',
      },
      {
        'id': '912299',
        'chainId': 'btc',
        'createdTimestamp': 1684029313,
        'from': [
          {'type': 'address', 'address': '110132'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'to': [
          {'type': 'contract', 'address': '310683'},
          // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        ],
        'status': 'FAILED',
      },
      //...
    ],
  };

  res.status(200).json(result); */
}
