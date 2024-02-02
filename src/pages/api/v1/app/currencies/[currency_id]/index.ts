// 018 - GET /app/currencies/:currency_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../lib/utils/prismaUtils';
import {ICurrencyDetail, IHolder} from '../../../../../../interfaces/currency';
import {IRedFlag} from '../../../../../../interfaces/red_flag';
import {IAddressInfo} from '../../../../../../interfaces/address_info';
import {ITransaction} from '../../../../../../interfaces/transaction';

type ResponseData = ICurrencyDetail | undefined;

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

  // Info: (20240125 - Julian) currency 的總量
  const totalAmount = parseInt(`${currencyData?.total_amount ?? 0}`);
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
  const holders: IHolder[] = holderData.map(holder => {
    // Info: (20240130 - Julian) 計算持有比例
    const value = parseInt(`${holder.value ?? 0}`);
    const holdingPercentage = value / totalAmount;

    return {
      addressId: `${holder.address}`,
      holdingAmount: parseInt(`${holder.value ?? 0}`),
      holdingPercentage: holdingPercentage,
      publicTag: [], // ToDo: (20240130 - Julian) 待補上
    };
  });

  // Info: (20240125 - Julian) 從 red_flags Table 中取得資料
  const flaggingData = await prisma.red_flags.findMany({
    select: {
      id: true,
      chain_id: true,
      red_flag_type: true,
      created_timestamp: true,
    },
  });
  const flagging: IRedFlag[] = flaggingData.map(flag => {
    return {
      id: `${flag.id}`,
      chainId: `${flag.chain_id}`,
      redFlagType: `${flag.red_flag_type}`,
      createdTimestamp: flag.created_timestamp ?? 0,
    };
  });

  // Info: (20240125 - Julian) 從 transactions Table 中取得 transactionHistoryData
  const chainId = currencyData?.chain_id;
  const transactionData = await prisma.token_transfers.findMany({
    where: {
      chain_id: chainId,
    },
    select: {
      id: true,
      chain_id: true,
      // created_timestamp: true, ToDo: (20240131 - Julian) 待 DB 補上這個欄位
      from_address: true,
      to_address: true,
    },
  });

  const transactionHistoryData: ITransaction[] = transactionData.map(transaction => {
    // Info: (20240130 - Julian) 轉換 timestamp
    // ToDo: (20240131 - Julian) 待 DB 補上這個欄位
    const transactionCreatedTimestamp = 0;

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

    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transactionCreatedTimestamp,
      from: from,
      to: to,
      type: 'Crypto Currency', // ToDo: (20240131 - Julian) 畫面需要調整，此欄位可能刪除
      status: 'SUCCESS', // ToDo: (20240131 - Julian) 畫面需要調整，此欄位可能刪除
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

  const volumeIn24h = parseInt(`${currencyData?.volume_in_24h ?? 0}`);

  const result: ResponseData = currencyData
    ? {
        currencyId: currencyData.id,
        currencyName: `${currencyData.name}`,
        rank: 0, // ToDo: (20240125 - Julian) 討論去留
        holderCount: currencyData.holder_count ?? 0,
        price: currencyData.price ?? 0,
        volumeIn24h: volumeIn24h,
        unit: unit,
        totalAmount: totalAmount,
        holders: holders,
        totalTransfers: currencyData.total_transfers ?? 0,
        flagging: flagging,
        flaggingCount: flagging.length,
        riskLevel: 'LOW_RISK', // ToDo: (20240125 - Julian) 需要參考 codes Table 並補上 riskLevel 的轉換
        transactionHistoryData: transactionHistoryData,
      }
    : // Info: (20240130 - Julian) 如果沒有找到資料，回傳 undefined
      undefined;

  prisma.$connect();
  res.status(200).json(result);
}
