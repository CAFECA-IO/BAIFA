// 015 - GET /app/chains/:chain_id/contracts/:contract_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../lib/utils/prismaUtils';
import {IAddressInfo} from '../../../../../../../interfaces/address_info';
import {IContractDetail} from '../../../../../../../interfaces/contract';
import {ITransaction} from '../../../../../../../interfaces/transaction';

type ResponseData = IContractDetail | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
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

  // Info: (20240205 - Julian) 轉換 type list
  const typeList = transactionCodes.filter(code => code.table_column === 'type');
  // Info: (20240205 - Julian) 轉換 status list
  const statusList = transactionCodes.filter(code => code.table_column === 'status');

  const transactionHistoryData: ITransaction[] = transactionData.map(transaction => {
    // Info: (20240130 - Julian) from address 轉換
    const fromAddresses = transaction.from_address ? transaction.from_address.split(',') : [];
    const from: IAddressInfo[] = fromAddresses
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
    const to: IAddressInfo[] = toAddresses
      // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
      .filter(address => address !== 'null')
      .map(address => {
        return {
          type: 'address', // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
          address: address,
        };
      });

    // Info: (20240205 - Julian) 找出對應的 type 和 status
    const type =
      typeList.find(code => code.value === parseInt(transaction.type ?? ''))?.meaning ?? '';
    const status =
      statusList.find(code => code.value === parseInt(transaction.status ?? ''))?.meaning ?? '';

    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transaction.created_timestamp ?? 0,
      from: from,
      to: to,
      type: type,
      status: status,
    };
  });

  const result: ResponseData = contractData
    ? {
        id: `${contractData.id}`,
        type: 'contract',
        contractAddress: `${contractData.contract_address}`,
        chainId: `${contractData.chain_id}`,
        creatorAddressId: `${contractData.creator_address}`,
        createdTimestamp: contractData.created_timestamp ?? 0,
        sourceCode: `${contractData.source_code}`,
        transactionHistoryData: transactionHistoryData,
        transactionCount: transactionHistoryData.length,
        publicTag: [], // ToDo: (20240124 - Julian) 補上這個欄位
      }
    : undefined;

  prisma.$connect();
  res.status(200).json(result);
}
