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

type ResponseData =
  | {
      id: string;
      type: 'contract';
      contractAddress: string;
      chainId: string;
      creatorAddressId: string;
      createdTimestamp: number;
      sourceCode: string;
      transactionHistoryData: TransactionData[];
      publicTag: string[];
    }
  | undefined;

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
            hasSome: [`${contractData.contract_address}`],
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
    // Info: (20240130 - Julian) 日期轉換
    const transactionTimestamp = transaction.created_timestamp
      ? new Date(transaction.created_timestamp).getTime() / 1000
      : 0;

    // Info: (20240130 - Julian) from address 轉換
    const fromAddresses = transaction.from_address ? transaction.from_address.split(',') : [];
    const from: AddressInfo[] = fromAddresses
      // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
      .filter(address => address !== 'null')
      .map(address => {
        return {
          type: 'address', // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
          address: address,
        };
      });

    // Info: (20240130 - Julian) to address 轉換
    const toAddresses = transaction.to_address ? transaction.to_address.split(',') : [];
    const to: AddressInfo[] = toAddresses
      // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
      .filter(address => address !== 'null')
      .map(address => {
        return {
          type: 'address', // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
          address: address,
        };
      });

    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transactionTimestamp,
      from: from,
      to: to,
      type: 'Crypto Currency', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 type 的轉換
      status: 'PENDING', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 status 的轉換
    };
  });

  const contractCreatedTimestamp = contractData?.created_timestamp
    ? new Date(contractData?.created_timestamp).getTime() / 1000
    : 0;

  const result: ResponseData = contractData
    ? {
        id: `${contractData.id}`,
        type: 'contract',
        contractAddress: `${contractData.contract_address}`,
        chainId: `${contractData.chain_id}`,
        creatorAddressId: `${contractData.creator_address}`,
        createdTimestamp: contractCreatedTimestamp,
        sourceCode: `${contractData.source_code}`,
        transactionHistoryData: transactionHistoryData,
        publicTag: [], // ToDo: (20240124 - Julian) 補上這個欄位
      }
    : undefined;

  res.status(200).json(result);
}
