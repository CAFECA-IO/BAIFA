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

  // Info: (20240219 - Liz) currency 總量小數後未滿18位數自動補零
  const totalAmountRawFilled = totalAmountRaw.padStart(19, '0');

  // Info: (20240219 - Liz) 取得切割點後第一個索引
  const splitIndex = totalAmountRawFilled.length - decimal; // decimal = 18

  // Info: (20240219 - Liz) 切割字串兩部分：整數部分和小數部分
  const firstPart = totalAmountRawFilled.substring(0, splitIndex);
  const secondPart = totalAmountRawFilled.substring(splitIndex);

  // Info: (20240219 - Liz) 整數部分每三位數一個逗號
  const firstPartWithComma = firstPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Info: (20240219 - Liz) 組合字串
  const totalAmount = `${firstPartWithComma}.${secondPart}`;

  const holders: IHolder[] = holderData.map(holder => {
    // Info: (20240220 - Liz) 取得持有數
    const rawHoldingValue = holder.value ?? '0';

    // Info: (20240220 - Liz) 持有數小數後未滿18位數自動補零
    const rawHoldingValueFilled = rawHoldingValue.padStart(19, '0');

    // Info: (20240220 - Liz) 持有數格式化
    const splitIndex = rawHoldingValueFilled.length - decimal; // decimal = 18
    const firstPart = rawHoldingValueFilled.substring(0, splitIndex);
    const secondPart = rawHoldingValueFilled.substring(splitIndex);
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

  // Info: (20240125 - Julian) 從 token_transfers Table 中取得 transactionHistoryData
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

  // Info: (20240222 - Liz) 從 codes Table 撈出 risk_level 的 value 和 meaning 的對照表為一個物件陣列
  const riskLevelCodes = await prisma.codes.findMany({
    where: {
      table_name: 'currencies',
      table_column: 'risk_level',
    },
    select: {
      value: true,
      meaning: true,
    },
  });

  // Info: (20240222 - Liz) 遍歷物件陣列 轉換成物件
  const riskLevelCodesObj: {
    [key: string]: string;
  } = {};
  riskLevelCodes.forEach(item => {
    if (item.value !== null) {
      riskLevelCodesObj[item.value] = item.meaning as string;
    }
  });

  // Info: (20240222 - Liz) 將資料庫傳來的 risk_level 轉換成對應的 meaning
  const riskLevel = currencyData?.risk_level
    ? riskLevelCodesObj[currencyData.risk_level]
    : 'Unknown Risk Level';

  // Info: (20240221 - Liz) 從 transactions Table 撈出 transaction_hash 和 status 組合成一個物件陣列
  const transactionHashStatusArr = await prisma.transactions.findMany({
    select: {
      hash: true,
      status: true,
    },
  });

  // Info: (20240222 - Liz) 將 transaction_hash 和 status 組合的物件陣列遍歷為一個物件
  const transactionHashStatusObj: {
    [key: string]: string;
  } = {};
  transactionHashStatusArr.forEach(item => {
    if (item.hash !== null) {
      transactionHashStatusObj[item.hash] = item.status as string;
    }
  });

  // Info: (20240222 - Liz) 從 codes Table 撈出 status 的 value 和 meaning 的對照表為一個物件陣列
  const statusCodes = await prisma.codes.findMany({
    where: {
      table_name: 'transactions',
      table_column: 'status',
    },
    select: {
      value: true,
      meaning: true,
    },
  });

  // Info: (20240222 - Liz) 遍歷物件陣列 轉換成物件
  const statusCodesObj: {
    [key: string]: string;
  } = {};
  statusCodes.forEach(item => {
    if (item.value !== null) {
      statusCodesObj[item.value] = item.meaning as string;
    }
  });

  // Info: (今天 - Liz) 將 transactionData 轉換成 transactionHistoryData
  const transactionHistoryData: ITransaction[] = transactionData.map(transaction => {
    // Info: (20240130 - Julian) from address 轉換
    const fromAddresses = transaction.from_address ? transaction.from_address.split(',') : [];

    const from: IAddressInfo[] = fromAddresses
      .filter(address => address !== 'null') // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
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

    // Info: (20240222 - Liz) 得到該筆交易 hash 所對應的 status
    const statusStr = transaction.transaction_hash
      ? transactionHashStatusObj[transaction.transaction_hash]
      : 'Unknown Status';

    // Info: (20240221 - Liz) 再將 status 轉換成對應的 meaning
    const status = statusCodesObj[statusStr] ?? 'Unknown Status';

    return {
      id: transaction.transaction_hash ?? '',
      chainId: `${transaction.chain_id}`,
      createdTimestamp: transaction.created_timestamp ?? 0,
      from: from,
      to: to,
      type: 'Crypto Currency', // ToDo: (20240131 - Julian) 畫面需要調整，此欄位可能刪除
      status: status, // ToDo: (20240131 - Julian) 畫面需要調整，此欄位可能刪除
    };
  });

  // Info: (20240221 - Liz) 組合回傳資料並轉換成 API 要的格式
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
        riskLevel: riskLevel,
        transactionHistoryData: transactionHistoryData,
        chainId: `${chainId}`,
      }
    : // Info: (20240130 - Julian) 如果沒有找到資料，回傳 undefined
      undefined;

  prisma.$connect();
  res.status(200).json(result);
}
