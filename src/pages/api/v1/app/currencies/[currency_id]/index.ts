// 018 - GET /app/currencies/:currency_id

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../lib/utils/prismaUtils';

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type HolderData = {
  addressId: string;
  holdingAmount: number;
  holdingPercentage: number;
  publicTag: string[];
};

type TransactionHistoryData = {
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
      currencyId: string;
      currencyName: string;
      rank: number;
      holderCount: number;
      price: number;
      volumeIn24h: number;
      unit: string;
      totalAmount: number;
      holders: HolderData[];
      totalTransfers: number;
      flaggingCount: number;
      riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
      transactionHistoryData: TransactionHistoryData[];
    }
  | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240112 - Julian) 解構 URL 參數，同時進行類型轉換
  const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;

  const currencyData = await prisma.currencies.findUnique({
    where: {
      id: currency_id,
    },
    select: {
      id: true,
      name: true,
      holder_count: true,
      price: true,
      volume_in_24h: true,
      total_transfers: true,
      total_amount: true,
      risk_level: true,
      chain_id: true,
    },
  });

  // Info: (20240125 - Julian) currency 的總量
  const totalAmount = currencyData?.total_amount ?? 0;
  // Info: (20240125 - Julian) 從 token_balances Table 中取得 holders
  const holderData = await prisma.token_balances.findMany({
    where: {
      currency_id: currency_id,
    },
    select: {
      address: true,
      value: true,
    },
  });
  const holders: HolderData[] = holderData.map(holder => {
    // Info: (20240130 - Julian) 計算持有比例
    const holdingPercentage = (holder.value ?? 0) / totalAmount;

    return {
      addressId: `${holder.address}`,
      holdingAmount: holder.value ?? 0,
      holdingPercentage: holdingPercentage,
      publicTag: [], // ToDo: (20240130 - Julian) 待補上
    };
  });

  // Info: (20240125 - Julian) 從 red_flags Table 中取得 redFlagCount
  const redFlagCount = await prisma.red_flags.count();

  // Info: (20240125 - Julian) 從 transactions Table 中取得 transactionHistoryData
  const chainId = currencyData?.chain_id;
  const transactionData = await prisma.transactions.findMany({
    where: {
      chain_id: chainId,
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
  });

  const transactionHistoryData: TransactionHistoryData[] = transactionData.map(transaction => {
    // Info: (20240130 - Julian) 轉換 timestamp
    const transactionCreatedTimestamp = transaction.created_timestamp
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
      createdTimestamp: transactionCreatedTimestamp,
      from: from,
      to: to,
      type: 'Crypto Currency', // ToDo: (20240126 - Julian) 需要參考 codes Table 並補上 type 的轉換
      status: 'SUCCESS', // ToDo: (20240126 - Julian) 需要參考 codes Table 並補上 status 的轉換
    };
  });

  // Info: (20240125 - Julian) 從 chains Table 中取得 unit
  const chainData = await prisma.chains.findUnique({
    where: {
      id: chainId ?? undefined,
    },
    select: {
      symbol: true,
    },
  });
  const unit = chainData?.symbol ?? '';

  const result: ResponseData = currencyData
    ? {
        currencyId: currencyData.id,
        currencyName: `${currencyData.name}`,
        rank: 0, // ToDo: (20240125 - Julian) 討論去留
        holderCount: currencyData.holder_count ?? 0,
        price: currencyData.price ?? 0,
        volumeIn24h: currencyData.volume_in_24h ?? 0,
        unit: unit, // ToDo: (20240125 - Julian) 補上這個欄位
        totalAmount: currencyData.total_amount ?? 0,
        holders: holders,
        totalTransfers: currencyData.total_transfers ?? 0,
        flaggingCount: redFlagCount,
        riskLevel: 'LOW_RISK', // ToDo: (20240125 - Julian) 需要參考 codes Table 並補上 riskLevel 的轉換
        transactionHistoryData: transactionHistoryData,
      }
    : // Info: (20240130 - Julian) 如果沒有找到資料，回傳 undefined
      undefined;

  res.status(200).json(result);
}
