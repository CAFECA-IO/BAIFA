// 105 - GET /app/tracking-tool interaction list

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../prisma/client';

type ResponseData = string[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;
  const blockchains = typeof req.query.blockchains === 'string' ? req.query.blockchains : undefined;
  const currencies = typeof req.query.currencies === 'string' ? req.query.currencies : undefined;
  const startTimeStamp =
    typeof req.query.start_date === 'string' && parseInt(req.query.start_date, 10) > 0
      ? parseInt(req.query.start_date, 10)
      : undefined;
  const endTimeStamp =
    typeof req.query.end_date === 'string' && parseInt(req.query.end_date, 10) > 0
      ? parseInt(req.query.end_date, 10)
      : undefined;

  // Info: (20240328 - Julian) 如果沒有拿到 address_id，回傳 400
  if (!address_id) {
    res.status(400).json([]);
    return;
  }

  try {
    // Info: (20240328 - Julian) 將 blockchains 和 currencies 轉換成陣列
    const blockchainList = blockchains?.split(',') ?? [];
    const currencyList = currencies?.split(',') ?? [];

    // Info: (20240402 - Julian) 撈出區塊鏈資料 -> 轉換成 id
    const chainData = await prisma.chains.findMany({
      where: {
        chain_name: {
          in: blockchainList,
        },
      },
      select: {
        id: true,
      },
    });
    const chainIds = blockchains ? chainData.map(chain => chain.id) : undefined;

    // Info: (20240402 - Julian) 撈出幣種資料 -> 轉換成 id
    const currencyData = await prisma.currencies.findMany({
      where: {
        name: {
          in: currencyList,
        },
      },
      select: {
        id: true,
      },
    });
    const currencyIds = currencies ? currencyData.map(currency => currency.id) : undefined;

    // Info: (20240402 - Julian) 撈出所有相關的交易資料
    const transactions = await prisma.transactions.findMany({
      where: {
        related_addresses: {
          // Info: (20240402 - Julian) 交易資料中包含 address_id
          has: address_id,
        },
        chain_id: {
          // Info: (20240402 - Julian) 交易資料中的區塊鏈在 blockchains 中
          in: chainIds,
        },
        created_timestamp: {
          // Info: (20240402 - Julian) 交易資料的時間在 startTimeStamp 和 endTimeStamp 之間
          gte: startTimeStamp,
          lte: endTimeStamp,
        },
      },
      select: {
        related_addresses: true,
      },
    });

    // Info: (20240328 - Julian) 將交易資料中的地址取出並去重
    const interactedRaw = transactions?.flatMap(transaction => transaction.related_addresses) ?? [];
    const interactedList = interactedRaw.filter(
      address => address !== address_id && address !== 'null'
    );
    const interactedSet = Array.from(new Set(interactedList));

    res.status(200).json(interactedSet);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in GET /app/tracking-tool interaction list', error);
    res.status(500).json([]);
  } finally {
    await prisma.$disconnect();
  }
}
