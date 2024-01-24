// 015 - GET /app/chains/:chain_id/contracts/:contract_id

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
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type ResponseData = {
  id: string;
  type: 'contract';
  contractAddress: string;
  chainId: string;
  creatorAddressId: string;
  createdTimestamp: number;
  sourceCode: string;
  transactionHistoryData: TransactionData[];
  publicTag: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const contractId =
    typeof req.query.contract_id === 'string' ? parseInt(req.query.contract_id) : undefined;

  const contractData = await prisma.contracts.findUnique({
    where: {
      id: contractId,
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

  // Info: (20240112 - Julian) -------------- transactions Table
  const transactionData = contractData
    ? await prisma.transactions.findMany({
        where: {
          related_addresses: {
            hasSome: [contractData?.contract_address],
          },
        },
        select: {
          id: true,
          chain_id: true,
          created_timestamp: true,
          from_address: true,
          to_address: true,
          type: true,
          status: true,
        },
      })
    : [];
  const transactionHistoryData: TransactionData[] = transactionData.map(transaction => {
    const from: AddressInfo[] = [];
    const to: AddressInfo[] = [];
    from.push({
      type: 'address', // ToDo: (20240124 - Julian) 先寫死
      address: transaction.from_address,
    });
    to.push({
      type: 'contract', // ToDo: (20240124 - Julian) 先寫死
      address: transaction.to_address,
    });

    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transaction.created_timestamp.getTime() / 1000,
      from: from,
      to: to,
      type: 'Crypto Currency', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 type 的轉換
      status: 'PENDING', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 status 的轉換
    };
  });

  const result: ResponseData = contractData
    ? {
        id: `${contractData.id}`,
        type: 'contract',
        contractAddress: contractData.contract_address,
        chainId: `${contractData.chain_id}`,
        creatorAddressId: `${contractData.creator_address}`,
        createdTimestamp: contractData.created_timestamp.getTime() / 1000,
        sourceCode: contractData.source_code,
        transactionHistoryData: transactionHistoryData,
        publicTag: [], // ToDo: (20240124 - Julian) 補上這個欄位
      }
    : {
        id: '',
        type: 'contract',
        contractAddress: '',
        chainId: '',
        creatorAddressId: '',
        createdTimestamp: 0,
        sourceCode: '',
        transactionHistoryData: [],
        publicTag: [],
      };

  res.status(200).json(result);
}
