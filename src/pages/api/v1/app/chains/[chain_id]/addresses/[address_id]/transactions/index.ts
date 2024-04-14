// 023 - GET /app/chains/:chain_id/addresses/:address_id/transactions

import type {NextApiRequest, NextApiResponse} from 'next';
import {AddressType} from '../../../../../../../../../interfaces/address_info';
import {IAddressRelatedTransaction} from '../../../../../../../../../interfaces/address';
import {IDisplayTransaction} from '../../../../../../../../../interfaces/transaction';
import prisma from '../../../../../../../../../../prisma/client';
import {
  CODE_WHEN_NULL,
  DEFAULT_PAGE,
  ITEM_PER_PAGE,
} from '../../../../../../../../../constants/config';

type ResponseData = IAddressRelatedTransaction | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240122 - Julian) 解構 URL 參數，同時進行類型轉換
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;
  const chain_id =
    typeof req.query.chain_id === 'string' ? parseInt(req.query.chain_id) : undefined;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : DEFAULT_PAGE;
  const offset =
    typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : ITEM_PER_PAGE;
  const start_date =
    typeof req.query.start_date === 'string' && parseInt(req.query.start_date, 10) > 0
      ? parseInt(req.query.start_date, 10)
      : undefined;
  const end_date =
    typeof req.query.end_date === 'string' && parseInt(req.query.end_date, 10) > 0
      ? parseInt(req.query.end_date, 10)
      : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;

  if (!address_id || !chain_id) {
    return res.status(400).json(undefined);
  }

  try {
    const skip = page > 0 ? (page - 1) * offset : 0;
    const queries = {
      related_addresses: {hasSome: [address_id]},
      created_timestamp: {
        gte: start_date,
        lte: end_date,
      },
      hash: search ? {startsWith: search} : undefined,
    };
    const totalCount = await prisma.transactions.count({
      where: {
        ...queries,
      },
    });

    const transactionData = await prisma.transactions.findMany({
      where: {
        ...queries,
      },
      orderBy: [
        {
          // Info: (20240301 - Shirley) 1. created_timestamp 由 sorting 決定
          created_timestamp: sort,
        },
        {
          // Info: (20240301 - Shirley) 2. id 由小到大
          id: sort,
        },
      ],
      take: offset,
      skip: skip,
      select: {
        id: true,
        chain_id: true,
        from_address: true,
        to_address: true,
        type: true,
        status: true,
        created_timestamp: true,
        related_addresses: true,
        hash: true,
      },
    });

    const transactionCodes = await prisma.codes.findMany({
      where: {
        table_name: 'transactions',
      },
      select: {
        table_column: true,
        value: true,
        meaning: true,
      },
    });

    const typeList = transactionCodes.filter(code => code.table_column === 'type');

    const transactionHistoryData: IDisplayTransaction[] = transactionData.map(transaction => {
      if (`${transaction.chain_id}` !== `${chain_id}`) {
        res.status(404).json(undefined);
      }
      /* Deprecated: use IDisplayTransaction instead of ITransaction (20240320 - Shirley)
      // // Info: (20240130 - Julian) from address 轉換
      // const fromAddresses = transaction.from_address ? transaction.from_address.split(',') : [];
      // const from: IAddressInfo[] = fromAddresses
      //   // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
      //   .filter(address => address !== 'null')
      //   .map(address => {
      //     return {
      //       type: AddressType.ADDRESS, // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
      //       address: address,
      //     };
      //   });

      // // Info: (20240130 - Julian) to address 轉換
      // const toAddresses = transaction.to_address ? transaction.to_address.split(',') : [];
      // const to: IAddressInfo[] = toAddresses
      //   // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
      //   .filter(address => address !== 'null')
      //   .map(address => {
      //     return {
      //       type: AddressType.ADDRESS, // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
      //       address: address,
      //     };
      //   });
      */

      const state =
        transactionCodes
          // Info: (20240207 - Shirley) 先過濾出 status
          .filter(code => code.table_column === 'status')
          // Info: (20240207 - Shirley) 再找出對應的 meaning；由於 status 是數字，所以要先轉換成數字再比對
          .find(code => code.value === parseInt(transaction?.status ?? ''))?.meaning ?? '';

      const type =
        typeList.find(code => code.value === +(transaction.type ?? CODE_WHEN_NULL))?.meaning ?? '';

      return {
        id: `${transaction.hash}`,
        chainId: `${transaction.chain_id}`,
        createdTimestamp: transaction.created_timestamp ?? 0,
        type: type,
        status: state,
      };
    });

    const totalPage = Math.ceil(totalCount / offset);

    const responseData: ResponseData = transactionData
      ? {
          id: `${address_id}`,
          type: AddressType.ADDRESS, // Info: transactions of certain address (20240301 - Shirley)
          address: `${address_id}`,
          transactions: transactionHistoryData,
          transactionCount: totalCount,
          totalPage: totalPage,
        }
      : undefined;

    res.status(200).json(responseData);
  } catch (error) {
    // Info: (20240506 - Shirley) 如果有錯誤就回傳 500
    // eslint-disable-next-line no-console
    console.error('Failed to fetch transaction details:', error);
    res.status(500).json(undefined);
  } finally {
    await prisma.$disconnect();
  }
}
