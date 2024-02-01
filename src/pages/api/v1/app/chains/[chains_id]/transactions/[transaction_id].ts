// 010 - GET /app/chains/:chain_id/transactions/:transaction_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../lib/utils/prismaUtils';

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type FlaggingRecords = {
  redFlagId: string;
  redFlagType: string;
};

type ResponseData =
  | {
      id: string;
      hash: string;
      type: 'Crypto Currency' | 'Evidence' | 'NFT';
      status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING';
      chainId: string;
      blockId: string;
      createdTimestamp: number;
      from: AddressInfo[];
      to: AddressInfo[];
      evidenceId: string | null;
      value: number;
      fee: number;
      unit: string;
      flaggingRecords: FlaggingRecords[];
    }
  | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240116 - Julian) 解構 URL 參數，同時進行類型轉換
  const transaction_id =
    typeof req.query.transaction_id === 'string' ? parseInt(req.query.transaction_id) : undefined;

  const transactionData = await prisma.transactions.findUnique({
    where: {
      id: transaction_id,
    },
    select: {
      id: true,
      hash: true,
      type: true,
      status: true,
      chain_id: true,
      block_hash: true,
      created_timestamp: true,
      from_address: true,
      to_address: true,
      // ToDo: (20240119 - Julian) 目前 DB 裡這欄是 null，所以先註解掉
      evidence_id: true,
      value: true,
      fee: true,
    },
  });

  // Info: (20240119 - Julian) 從 chains Table 撈出 chain_icon 和 decimals
  const chain_id = transactionData?.chain_id ?? 0;
  const chainData = await prisma.chains.findUnique({
    where: {
      id: chain_id,
    },
    select: {
      symbol: true,
      decimals: true,
    },
  });
  const unit = chainData?.symbol ?? '';
  const decimals = chainData?.decimals ?? 0;

  // Info: (20240119 - Julian) 從 blocks Table 撈出 block_id
  const blockHash = transactionData?.block_hash ?? '';
  const blockData = await prisma.blocks.findFirst({
    where: {
      hash: blockHash,
    },
    select: {
      number: true,
    },
  });
  const blockId = `${blockData?.number}` ?? '';

  // Info: (20240126 - Julian) 計算 fee
  const fee = parseInt(`${transactionData?.fee ?? 0}`);
  const feeDecimal = fee / Math.pow(10, decimals);

  const value = parseInt(`${transactionData?.value ?? 0}`);

  // Info: (20240130 - Julian) from / to address 轉換
  const fromAddresses = transactionData?.from_address
    ? transactionData?.from_address.split(',')
    : [];
  const from: AddressInfo[] = fromAddresses
    // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
    .filter(address => address !== 'null')
    .map(address => {
      return {
        type: 'address', // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
        address: address,
      };
    });

  const toAddresses = transactionData?.to_address ? transactionData?.to_address.split(',') : [];
  const to: AddressInfo[] = toAddresses
    // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
    .filter(address => address !== 'null')
    .map(address => {
      return {
        type: 'address', // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
        address: address,
      };
    });

  // Info: (20240130 - Julian) 警示紀錄
  const flaggings = await prisma.red_flags.findMany({
    where: {
      related_transactions: {
        hasSome: [`${transaction_id}`],
      },
    },
    select: {
      id: true,
      red_flag_type: true,
    },
  });

  const flaggingRecords = flaggings.map(flagging => {
    return {
      redFlagId: `${flagging.id}`,
      redFlagType: `${flagging.red_flag_type}`,
    };
  });

  // Info: (20240119 - Julian) 轉換成 API 要的格式
  const result: ResponseData = transactionData
    ? {
        id: `${transactionData.id}`,
        hash: `${transactionData.hash}`,
        type: 'Crypto Currency', // ToDo: (20240119 - Julian) 須參考 codes Table 並補上 type 的轉換
        status: 'SUCCESS', // ToDo: (20240119 - Julian) 須參考 codes Table 並補上 status 的轉換
        chainId: `${transactionData.chain_id}`,
        blockId: blockId,
        createdTimestamp: transactionData.created_timestamp ?? 0,
        from: from,
        to: to,
        evidenceId: transactionData.evidence_id,
        value: value,
        fee: feeDecimal,
        unit: unit,
        flaggingRecords: flaggingRecords,
      }
    : // Info: (20240130 - Julian) 如果沒有找到資料，回傳 undefined
      undefined;

  prisma.$connect();
  res.status(200).json(result);
}
