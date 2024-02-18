// 010 - GET /app/chains/:chain_id/transactions/:transaction_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../lib/utils/prismaUtils';
import {ITransactionDetail} from '../../../../../../../interfaces/transaction';
import {AddressType, IAddressInfo} from '../../../../../../../interfaces/address_info';

type ResponseData = ITransactionDetail | undefined;

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
      evidence_id: true,
      value: true,
      fee: true,
    },
  });

  // Info: (20240205 - Julian) 從 codes Table 撈出 type 和 status
  const codes = await prisma.codes.findMany({
    where: {
      table_name: 'transactions',
    },
    select: {
      table_column: true,
      value: true,
      meaning: true,
    },
  });

  // Info: (20240205 - Julian) 轉換 type
  const type =
    codes
      // Info: (20240205 - Julian) 先過濾出 type
      .filter(code => code.table_column === 'type')
      // Info: (20240205 - Julian) 再找出對應的 meaning；由於 type 是數字，所以要先轉換成數字再比對
      .find(code => code.value === parseInt(transactionData?.type ?? ''))?.meaning ?? '';

  // Info: (20240205 - Julian) 轉換 status
  const status =
    codes
      // Info: (20240205 - Julian) 先過濾出 status
      .filter(code => code.table_column === 'status')
      // Info: (20240205 - Julian) 再找出對應的 meaning；由於 status 是數字，所以要先轉換成數字再比對
      .find(code => code.value === parseInt(transactionData?.status ?? ''))?.meaning ?? '';

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

  // Info: (20240130 - Julian) 撈出所有 address
  const allAddress = await prisma.addresses.findMany({
    select: {
      address: true,
    },
  });
  const allAddressArray = allAddress.map(address => address.address);

  // Info: (20240130 - Julian) from address 轉換
  const fromAddressesRaw = transactionData?.from_address
    ? transactionData?.from_address.split(',')
    : [];
  // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
  const fromAddresses = fromAddressesRaw.filter(address => address !== 'null');
  // Info: (20240206 - Julian) 掃描 fromAddresses，如果 `addresses` table 有對應的 address 資料，就輸出 'address'，否則輸出 'contract'
  const fromType = fromAddresses.map(address => {
    return allAddressArray.includes(address) ? AddressType.ADDRESS : AddressType.CONTRACT;
  });
  const from: IAddressInfo[] = fromAddresses.map((address, index) => {
    return {
      type: fromType[index],
      address: address,
    };
  });

  // Info: (20240130 - Julian) to address 轉換
  const toAddressesRaw = transactionData?.to_address ? transactionData?.to_address.split(',') : [];
  // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
  const toAddresses = toAddressesRaw.filter(address => address !== 'null');
  // Info: (20240206 - Julian) 掃描 toAddresses，如果 `addresses` table 有對應的 address 資料，就輸出 'address'，否則輸出 'contract'
  const toType = toAddresses.map(address => {
    return allAddressArray.includes(address) ? AddressType.ADDRESS : AddressType.CONTRACT;
  });
  const to: IAddressInfo[] = toAddresses.map((address, index) => {
    return {
      type: toType[index],
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

  // Info: (20240201 - Julian) 如果 evidence_id 為 null，就不回傳
  const evidenceId =
    transactionData?.evidence_id !== null ? transactionData?.evidence_id : undefined;

  // Info: (20240119 - Julian) 轉換成 API 要的格式
  const result: ResponseData = transactionData
    ? {
        id: `${transactionData.id}`,
        hash: `${transactionData.hash}`,
        type: type,
        status: status,
        chainId: `${transactionData.chain_id}`,
        blockId: blockId,
        createdTimestamp: transactionData.created_timestamp ?? 0,
        from: from,
        to: to,
        evidenceId: evidenceId,
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
