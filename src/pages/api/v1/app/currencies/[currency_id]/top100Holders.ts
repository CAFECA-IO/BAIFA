// 028 - GET /app/currencies/:currency_id/holders

// Get 100 top holders of a currency

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../prisma/client';
import {IHolder, ITop100Holders} from '../../../../../../interfaces/currency';
import {ITEM_PER_PAGE} from '../../../../../../constants/config';

type ResponseData = ITop100Holders | string;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (今天 - Liz) query string
  const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;

  // Info: (今天 - Liz) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * ITEM_PER_PAGE : undefined; // Info: (20240306 - Liz) 跳過前面幾筆
  const take = ITEM_PER_PAGE; // Info: (20240306 - Liz) 取幾筆

  try {
    // Info: (今天 - Liz) 從 currencies Table 中取得 total_amount 和 chain_id
    const currencyData = await prisma.currencies.findUnique({
      where: {
        id: currency_id,
      },
      select: {
        total_amount: true,
        chain_id: true,
      },
    });

    // Info: (今天 - Liz) currency 的總量
    const totalAmountRaw = currencyData?.total_amount ?? '0';

    // Info: (今天 - Liz) 從 chains Table 中取得 unit 和 decimal
    const chainId = currencyData?.chain_id;
    const decimalsOfChain = await prisma.chains.findUnique({
      where: {
        id: chainId ?? undefined,
      },
      select: {
        decimals: true,
      },
    });
    const decimal = decimalsOfChain?.decimals ?? 0;

    // Info: (今天 - Liz) 從 token_balances Table 中取得 holders
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

    const result = {
      holdersData: holders,
      totalPages: 1,
    };

    prisma.$connect();
    res.status(200).json(result);
  } catch (error) {
    // Info: (今天 - Liz) Request error
    // eslint-disable-next-line no-console
    console.error('Error in holders:', error);
    res.status(500).json({} as ResponseData);
  }
}
