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

  // Info: (20240125 - Julian) currency 的 24 小時交易量
  const volumeIn24hRaw = parseInt(`${currencyData?.volume_in_24h ?? 0}`);
  const volumeIn24h = volumeIn24hRaw / Math.pow(10, decimal);

  // Info: (20240125 - Julian) currency 的總量
  const totalAmountRaw = currencyData?.total_amount ?? '0';

  // Info: (20240219 - Liz) 取得切割點後第一個索引
  const splitIndex = totalAmountRaw.length - decimal; // decimal = 18

  // Info: (20240219 - Liz) 切割字串
  const firstPart = totalAmountRaw.substring(0, splitIndex);
  const secondPart = totalAmountRaw.substring(splitIndex);

  // Info: (20240219 - Liz) firstPart 每三位數一個逗號
  const firstPartWithComma = firstPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Info: (20240219 - Liz) 組合字串
  const totalAmount = `${firstPartWithComma}.${secondPart}`;

  const holders: IHolder[] = holderData.map(holder => {
    // Info: (20240220 - Liz) 取得持有數
    const rawHoldingValue = holder.value ?? '0';

    // Info: (20240220 - Liz) 持有數格式化
    const splitIndex = rawHoldingValue.length - decimal; // decimal = 18
    const firstPart = rawHoldingValue.substring(0, splitIndex);
    const secondPart = rawHoldingValue.substring(splitIndex);
    const firstPartWithComma = firstPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const holdingAmount = `${firstPartWithComma}.${secondPart}`;

    // Info: (20240130 - Julian) 計算持有比例
    const rawHoldingValueBigInt = BigInt(rawHoldingValue);
    const scale = BigInt(10000);
    const scaleRawHoldingValueBigInt = rawHoldingValueBigInt * scale;
    const holdingPercentageBigInt = scaleRawHoldingValueBigInt / BigInt(totalAmountRaw);
    const holdingPercentageString = holdingPercentageBigInt.toString();

    // Info: (20240220 - Liz) 將持有比例格式化為小數點後2位小數
    const formatString = (str: string) => {
      const paddedA = str.padStart(3, '0'); // 字串前面補零，直到長度為3
      const integerPart = paddedA.slice(0, -2); // 整數部分
      const decimalPart = paddedA.slice(-2); // 小數部分
      return `${integerPart}.${decimalPart}`;
    };

    const holdingPercentage = formatString(holdingPercentageString);

    // Info: (20240202 - Julian) 計算持有比例的 bar 寬度
    const holdingBarWidth = Number(holdingPercentage);

    return {
      addressId: `${holder.address}`,
      holdingAmount: holdingAmount,
      holdingPercentage: holdingPercentage,
      holdingBarWidth: holdingBarWidth,
      publicTag: ['Unknown User'], // ToDo: (20240130 - Julian) 待補上
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
      created_timestamp: true,
      from_address: true,
      to_address: true,
      transaction_hash: true,
    },
  });

  const transactionHistoryData: ITransaction[] = transactionData.map(transaction => {
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
      id: transaction.transaction_hash ?? '',
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transaction.created_timestamp ?? 0,
      from: from,
      to: to,
      type: 'Crypto Currency', // ToDo: (20240131 - Julian) 畫面需要調整，此欄位可能刪除
      status: 'Success', // ToDo: (20240131 - Julian) 畫面需要調整，此欄位可能刪除
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
