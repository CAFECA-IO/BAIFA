// 018 - GET /app/currencies/:currency_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../lib/utils/prismaUtils';
import {ICurrencyDetailString, IHolder} from '../../../../../../interfaces/currency';
import {IRedFlag} from '../../../../../../interfaces/red_flag';
import {AddressType, IAddressInfo} from '../../../../../../interfaces/address_info';
import {ITransaction} from '../../../../../../interfaces/transaction';

type ResponseData = ICurrencyDetailString | undefined;

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

  // Info: (20240125 - Julian) 從 chains Table 中取得 unit 和 decimal
  const chainId = currencyData?.chain_id;
  const chainData = await prisma.chains.findUnique({
    where: {
      id: chainId ?? undefined,
    },
    select: {
      symbol: true,
      decimals: true,
    },
  });
  const unit = chainData?.symbol ?? '';
  const decimal = chainData?.decimals ?? 0;

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

  // Info: (20240125 - Julian) 取得持有數最多的 value
  const maxHolding = await prisma.token_balances.aggregate({
    _max: {
      value: true,
    },
  });
  const maxHoldingAmount = parseInt(`${maxHolding._max.value ?? 0}`);

  // Info: (20240125 - Julian) currency 的 24 小時交易量
  const volumeIn24hRaw = parseInt(`${currencyData?.volume_in_24h ?? 0}`);
  const volumeIn24h = volumeIn24hRaw / Math.pow(10, decimal);

  // Info: (20240125 - Julian) currency 的總量 (total_amount 格式是小數點後有18位數的字串 & 小數點前每三位數一個逗號)
  const totalAmountRaw = currencyData?.total_amount ?? '0';
  // Info: (今天 - Liz) 取得切割點後第一個索引
  const splitIndex = totalAmountRaw.length - 18;
  // Info: (今天 - Liz) 切割字串
  const firstPart = totalAmountRaw.substring(0, splitIndex);
  const secondPart = totalAmountRaw.substring(splitIndex);

  // Info: (今天 - Liz) firstPart 每三位數一個逗號
  const firstPartWithComma = firstPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Info: (今天 - Liz) 組合字串
  const totalAmount = `${firstPartWithComma}.${secondPart}`;

  // Deprecated: (今天 - Liz)
  // eslint-disable-next-line no-console
  console.log('totalAmountRaw', totalAmountRaw, 'totalAmount', totalAmount);

  const holders: IHolder[] = holderData.map(holder => {
    // Info: (20240130 - Julian) 計算持有比例
    const value = parseInt(`${holder.value ?? 0}`);
    const holdingPercentage = value / parseInt(totalAmount);
    // Info: (20240202 - Julian) 計算持有比例的 bar 寬度，取到小數點後兩位
    const holdingBarWidth = Math.round((value / maxHoldingAmount) * 10000) / 100;
    // Info: (20240202 - Julian) holdingAmount = value/10^decimal
    const holdingAmount = value / Math.pow(10, decimal);
    return {
      addressId: `${holder.address}`,
      holdingAmount: holdingAmount,
      holdingPercentage: holdingPercentage,
      holdingBarWidth: holdingBarWidth,
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
          type: AddressType.ADDRESS, // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
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
          type: AddressType.ADDRESS, // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
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
