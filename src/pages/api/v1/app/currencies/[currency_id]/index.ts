// 018 - GET /app/currencies/:currency_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../lib/utils/prismaUtils';

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

type ResponseData = {
  currencyId: string;
  currencyName: string;
  rank: number;
  chainIcon: string;
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
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

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

  const holders: HolderData[] = [];
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
  holderData.forEach(holder => {
    holders.push({
      addressId: holder.address,
      holdingAmount: holder.value,
      holdingPercentage: (holder.value / totalAmount) * 100,
      publicTag: [], // ToDo: (20240125 - Julian) 補上這個欄位
    });
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
    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: new Date(transaction.created_timestamp).getTime() / 1000,
      from: [
        {
          type: 'address',
          address: transaction.from_address,
        },
      ],
      to: [
        {
          type: 'address',
          address: transaction.to_address,
        },
      ],
      type: 'Crypto Currency', // ToDo: (20240126 - Julian) 需要參考 codes Table 並補上 type 的轉換
      status: 'SUCCESS', // ToDo: (20240126 - Julian) 需要參考 codes Table 並補上 status 的轉換
    };
  });

  // Info: (20240125 - Julian) 從 chains Table 中取得 chainIcon
  const chainData = await prisma.chains.findUnique({
    where: {
      id: chainId,
    },
    select: {
      chain_icon: true,
    },
  });
  const chainIcon = chainData?.chain_icon ?? '';

  const result: ResponseData = currencyData
    ? {
        currencyId: currencyData.id,
        currencyName: currencyData.name,
        rank: 0, // ToDo: (20240125 - Julian) 討論去留
        chainIcon: chainIcon,
        holderCount: currencyData.holder_count,
        price: currencyData.price,
        volumeIn24h: currencyData.volume_in_24h,
        unit: 'BTC', // ToDo: (20240125 - Julian) 補上這個欄位
        totalAmount: currencyData.total_amount,
        holders: holders,
        totalTransfers: currencyData.total_transfers,
        flaggingCount: redFlagCount,
        riskLevel: 'LOW_RISK', // ToDo: (20240125 - Julian) 需要參考 codes Table 並補上 riskLevel 的轉換
        transactionHistoryData: transactionHistoryData,
      }
    : {
        currencyId: '',
        currencyName: '',
        rank: 0,
        chainIcon: '',
        holderCount: 0,
        price: 0,
        volumeIn24h: 0,
        unit: '',
        totalAmount: 0,
        holders: [],
        totalTransfers: 0,
        flaggingCount: 0,
        riskLevel: 'LOW_RISK',
        transactionHistoryData: [],
      };

  res.status(200).json(result);
}
