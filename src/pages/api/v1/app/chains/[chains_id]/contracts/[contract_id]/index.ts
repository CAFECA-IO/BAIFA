// 015 - GET /app/chains/:chain_id/contracts/:contract_id

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../../../prisma/client';
import {AddressType} from '../../../../../../../../interfaces/address_info';
import {IContractBrief} from '../../../../../../../../interfaces/contract';

type ResponseData = IContractBrief | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const contractId = typeof req.query.contract_id === 'string' ? req.query.contract_id : undefined;

  const contractData = await prisma.contracts.findFirst({
    where: {
      contract_address: contractId,
    },
    select: {
      id: true,
      contract_address: true,
      chain_id: true,
      creator_address: true,
      created_timestamp: true,
      source_code: true,
    },
  });

  const result: ResponseData = contractData
    ? {
        id: `${contractData.id}`,
        type: AddressType.CONTRACT,
        contractAddress: `${contractData.contract_address}`,
        chainId: `${contractData.chain_id}`,
        creatorAddressId: `${contractData.creator_address}`,
        createdTimestamp: contractData.created_timestamp ?? 0,
        sourceCode: `${contractData.source_code}`,
        publicTag: ['Unknown User'], // ToDo: (20240124 - Julian) 補上這個欄位
      }
    : undefined;

  prisma.$connect();
  res.status(200).json(result);
}
