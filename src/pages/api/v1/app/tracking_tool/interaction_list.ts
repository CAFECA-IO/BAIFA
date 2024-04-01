// 102 - GET /app/tracking-tool interaction list

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../prisma/client';

type ResponseData = string[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;

  // Info: (20240328 - Julian) 如果沒有拿到 address_id，回傳 400
  if (!address_id) {
    res.status(400).json([]);
    return;
  }

  try {
    // Info: (20240328 - Julian) 撈出所有相關的交易資料
    const transactions = await prisma.transactions.findMany({
      where: {
        related_addresses: {
          has: address_id,
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
