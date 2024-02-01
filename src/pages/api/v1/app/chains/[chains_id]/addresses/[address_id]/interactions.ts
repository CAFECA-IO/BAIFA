// 014 - GET /app/chains/:chain_id/addresses/:address_id/interactions?type=address

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {IInteractionItem} from '../../../../../../../../interfaces/interaction_item';

type ResponseData = IInteractionItem[];

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

  // Info: (20240131 - Julian) 將關聯 addresses 整理成一個 array
  const interactedAddressesRaw = interactedData.flatMap(transaction => {
    // Info: (20240131 - Julian) 過濾 address_id 以及 null
    return transaction.related_addresses.filter(
      address => address !== address_id && address !== 'null'
    );
  });
  // Info: (20240131 - Julian) 過濾重複的 address
  const interactedAddresses = Array.from(new Set(interactedAddressesRaw));

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
        return {
          id: `${address.address}`,
          type: 'address',
          chainId: `${chain_id}`,
          publicTag: [], // ToDo: (20240124 - Julian) 補上這個欄位
          createdTimestamp: address.created_timestamp ?? 0,
          transactionCount: 0, // ToDo: (20240124 - Julian) 補上這個欄位
        };
      })
    : [];

  prisma.$connect();
  res.status(200).json(result);
}
