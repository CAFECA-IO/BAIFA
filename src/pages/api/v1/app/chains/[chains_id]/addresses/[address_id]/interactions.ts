// 014 - GET /app/chains/:chain_id/addresses/:address_id/interactions?type=address

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';

type ResponseData = {
  id: string;
  type: 'address' | 'contract';
  chainId: string;
  publicTag: string[];
  createdTimestamp: number;
  transactionCount: number;
}[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240122 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id) : undefined;
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;

  // Info: (20240122 - Julian) -------------- 透過 transactions Table 找出有關聯項目 --------------
  const interactedData = address_id
    ? await prisma.transactions.findMany({
        where: {
          related_addresses: {
            hasSome: [address_id],
          },
        },
        select: {
          related_addresses: true,
        },
      })
    : [];

  // Info: (20240124 - Julian) 將關聯 addresses 整理成一個 array
  const interactedAddresses: string[] = [];
  interactedData.forEach(transaction => {
    transaction.related_addresses.forEach(a => {
      if (a !== address_id && a !== 'null' && interactedAddresses.indexOf(a) === -1) {
        interactedAddresses.push(a);
      }
    });
  });
  // Info: (20240124 - Julian) -------------- 透過 addresses Table 找出關聯資料 --------------
  const interactedList = await prisma.addresses.findMany({
    where: {
      address: {
        in: interactedAddresses,
      },
    },
    select: {
      id: true,
      chain_id: true,
      created_timestamp: true,
      address: true,
    },
  });

  const result: ResponseData = interactedList
    ? interactedList.map(address => {
        const interactedTimestamp = address.created_timestamp
          ? new Date(address.created_timestamp).getTime() / 1000
          : 0;

        return {
          id: `${address.address}`,
          type: 'address',
          chainId: `${chain_id}`,
          publicTag: [], // ToDo: (20240124 - Julian) 補上這個欄位
          createdTimestamp: interactedTimestamp,
          transactionCount: 0, // ToDo: (20240124 - Julian) 補上這個欄位
        };
      })
    : [];

  res.status(200).json(result);
}
