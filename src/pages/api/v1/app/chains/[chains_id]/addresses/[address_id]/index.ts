// 011 - GET /app/chains/:chain_id/addresses/:address_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {IAddressInfo} from '../../../../../../../../interfaces/address_info';
import {IAddressDetail} from '../../../../../../../../interfaces/address';
import {IReviewDetail} from '../../../../../../../../interfaces/review';
import {IProductionBlock} from '../../../../../../../../interfaces/block';
import {ITransaction} from '../../../../../../../../interfaces/transaction';

type ResponseData = IAddressDetail | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240122 - Julian) 解構 URL 參數，同時進行類型轉換
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;

  if (!address_id) {
    return res.status(400).json({} as ResponseData);
  }

  try {
    // Info: Parallelize database calls with Promise.all (20240205 - Shirley)
    const [addressData, transactionData, blockData, reviewDataRaw, flaggingRecords] =
      await Promise.all([
        prisma.addresses.findUnique({
          where: {address: address_id},
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            address: true,
            score: true,
            latest_active_time: true,
          },
        }),
        prisma.transactions.findMany({
          where: {related_addresses: {hasSome: [address_id]}},
          select: {
            id: true,
            chain_id: true,
            from_address: true,
            to_address: true,
            type: true,
            status: true,
            created_timestamp: true,
            related_addresses: true,
          },
        }),
        prisma.blocks.findMany({
          where: {miner: address_id},
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            reward: true,
          },
        }),
        prisma.review_datas.findMany({
          where: {target: address_id},
          select: {
            id: true,
            created_timestamp: true,
            author_address: true,
            content: true,
            stars: true,
          },
        }),
        prisma.red_flags.findMany({
          where: {related_addresses: {hasSome: [address_id]}},
          select: {id: true, red_flag_type: true},
        }),
      ]);

    // Assuming chainData is necessary for further calculations, fetch it based on addressData
    const chainData = !!addressData?.chain_id
      ? await prisma.chains.findUnique({
          where: {id: addressData.chain_id},
          select: {symbol: true, decimals: true},
        })
      : null;

    // Process and map data here as per your original logic
    const unit = chainData?.symbol ? chainData.symbol : '';
    const decimals = chainData?.decimals ? chainData.decimals : 0;

    const transactionHistoryData: ITransaction[] = transactionData.map(transaction => {
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
        createdTimestamp: transaction.created_timestamp ?? 0,
        from: from,
        to: to,
        type: 'Crypto Currency', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 type 的轉換
        status: 'PENDING', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 status 的轉換
      };
    });

    const blockProducedData: IProductionBlock[] = blockData.map(block => {
      // Info: (20240130 - Julian) reward 轉換
      const rewardRaw = block.reward ? parseInt(block.reward) : 0;
      const reward = rewardRaw / Math.pow(10, decimals);

      return {
        id: `${block.id}`,
        chainId: `${block.chain_id}`,
        createdTimestamp: block.created_timestamp ?? 0,
        stability: 'MEDIUM', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 stability 的轉換
        reward: reward,
        unit: unit,
      };
    });

    // Formulate the response
    const responseData: ResponseData = addressData
      ? {
          // Populate your response data structure here based on the fetched and processed data
          id: `${addressData.id}`,
          type: 'address',
          chainId: `${addressData.chain_id}`,
          createdTimestamp: addressData.created_timestamp ?? 0,
          address: `${addressData.address}`,
          latestActiveTime: addressData.latest_active_time ?? 0,
          interactedAddressCount: transactionData.length,
          interactedContactCount: 0, // ToDo: (20240122 - Julian) 補上這個欄位
          score: addressData.score ?? 0,
          reviewData: reviewDataRaw.map(review => {
            return {
              id: `${review.id}`,
              transactionId: `${review.id}`,
              chainId: `${review.id}`,
              createdTimestamp: review.created_timestamp ?? 0,
              authorAddressId: `${review.author_address}`,
              content: `${review.content}`,
              stars: review.stars ?? 0,
            };
          }),
          transactionHistoryData: transactionHistoryData,
          transactionCount: transactionHistoryData.length,
          blockProducedData: blockProducedData,
          flaggingCount: flaggingRecords.length,
          riskLevel: 'LOW_RISK', // ToDo: (20240122 - Julian) 補上這個欄位
          publicTag: [], // ToDo: (20240122 - Julian) 補上這個欄位
        }
      : undefined;

    res.status(200).json(responseData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch address details:', error);
    res.status(500).json({} as ResponseData);
  } finally {
    await prisma.$disconnect();
  }

  /* TODO: optmizational trial (20240205 - Shirley)
  // // Info: (20240122 - Julian) -------------- 透過 addresses Table 找出 address_id 的資料 --------------
  // const addressData = await prisma.addresses.findUnique({
  //   where: {
  //     address: address_id,
  //   },
  //   select: {
  //     id: true,
  //     chain_id: true,
  //     created_timestamp: true,
  //     address: true,
  //     score: true,
  //     latest_active_time: true,
  //   },
  // });

  // const chainData = await prisma.chains.findUnique({
  //   where: {
  //     id: addressData?.chain_id ?? undefined,
  //   },
  //   select: {
  //     symbol: true,
  //     decimals: true,
  //   },
  // });

  // const unit = chainData?.symbol ? chainData.symbol : '';
  // const decimals = chainData?.decimals ? chainData.decimals : 0;

  // // Info: (20240122 - Julian) -------------- 在 transactions Table 找出所有與 address_id 相關的交易 --------------
  // // SELECT * FROM transactions WHERE related_addresses LIKE '%address_id%'
  // const transactionData = address_id
  //   ? await prisma.transactions.findMany({
  //       where: {
  //         related_addresses: {
  //           hasSome: [address_id],
  //         },
  //       },
  //       select: {
  //         id: true,
  //         chain_id: true,
  //         from_address: true,
  //         to_address: true,
  //         type: true,
  //         status: true,
  //         created_timestamp: true,
  //         related_addresses: true,
  //       },
  //     })
  //   : [];

  // // Info: (20240122 - Julian) ================== transactionHistoryData ==================
  // const transactionHistoryData: ITransaction[] = transactionData.map(transaction => {
  //   // Info: (20240130 - Julian) from address 轉換
  //   const fromAddresses = transaction.from_address ? transaction.from_address.split(',') : [];
  //   const from: IAddressInfo[] = fromAddresses
  //     // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
  //     .filter(address => address !== 'null')
  //     .map(address => {
  //       return {
  //         type: 'address', // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
  //         address: address,
  //       };
  //     });

  //   // Info: (20240130 - Julian) to address 轉換
  //   const toAddresses = transaction.to_address ? transaction.to_address.split(',') : [];
  //   const to: IAddressInfo[] = toAddresses
  //     // Info: (20240130 - Julian) 如果 address 為 null 就過濾掉
  //     .filter(address => address !== 'null')
  //     .map(address => {
  //       return {
  //         type: 'address', // ToDo: (20240130 - Julian) 先寫死，等待後續補上 contract
  //         address: address,
  //       };
  //     });

  //   return {
  //     id: `${transaction.id}`,
  //     chainId: `${transaction.chain_id}`,
  //     createdTimestamp: transaction.created_timestamp ?? 0,
  //     from: from,
  //     to: to,
  //     type: 'Crypto Currency', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 type 的轉換
  //     status: 'PENDING', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 status 的轉換
  //   };
  // });

  // // Info: (20240122 - Julian) 透過 transactions Table 的 related_addresses 欄位找出所有相關的 address
  // const relatedAddressesRaw = transactionData.flatMap(transaction => {
  //   // Info: (20240131 - Julian) 過濾掉 null 和 address_id
  //   return transaction.related_addresses.filter(
  //     address => address !== address_id && address !== 'null'
  //   );
  // });
  // // Info: (20240131 - Julian) 過濾重複的 address
  // const relatedAddresses = Array.from(new Set(relatedAddressesRaw));

  // // Info: (20240122 - Julian) ================== blockProducedData ==================
  // const blockData = address_id
  //   ? await prisma.blocks.findMany({
  //       where: {
  //         miner: address_id,
  //       },
  //       select: {
  //         id: true,
  //         chain_id: true,
  //         created_timestamp: true,
  //         reward: true,
  //       },
  //     })
  //   : [];

  // const blockProducedData: IProductionBlock[] = blockData.map(block => {
  //   // Info: (20240130 - Julian) reward 轉換
  //   const rewardRaw = block.reward ? parseInt(block.reward) : 0;
  //   const reward = rewardRaw / Math.pow(10, decimals);

  //   return {
  //     id: `${block.id}`,
  //     chainId: `${block.chain_id}`,
  //     createdTimestamp: block.created_timestamp ?? 0,
  //     stability: 'MEDIUM', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 stability 的轉換
  //     reward: reward,
  //     unit: unit,
  //   };
  // });

  // // Info: (20240130 - Julian) ================== reviewData ==================
  // const reviewDataRaw = await prisma.review_datas.findMany({
  //   where: {
  //     target: address_id,
  //   },
  //   select: {
  //     id: true,
  //     created_timestamp: true,
  //     author_address: true,
  //     content: true,
  //     stars: true,
  //   },
  // });
  // const reviewData: IReviewDetail[] = reviewDataRaw.map(review => {
  //   return {
  //     id: `${review.id}`,
  //     transactionId: `${review.id}`,
  //     chainId: `${review.id}`,
  //     createdTimestamp: review.created_timestamp ?? 0,
  //     authorAddressId: `${review.author_address}`,
  //     content: `${review.content}`,
  //     stars: review.stars ?? 0,
  //   };
  // });

  // // Info: (20240130 - Julian) ================== flaggingCount ==================
  // const flaggingRecords = await prisma.red_flags.findMany({
  //   where: {
  //     related_addresses: {
  //       hasSome: [`${address_id}`],
  //     },
  //   },
  //   select: {
  //     id: true,
  //     red_flag_type: true,
  //   },
  // });

  // const result: ResponseData = addressData
  //   ? {
  //       id: `${addressData.id}`,
  //       type: 'address',
  //       address: `${addressData.address}`,
  //       chainId: `${addressData.chain_id}`,
  //       createdTimestamp: addressData.created_timestamp ?? 0,
  //       latestActiveTime: addressData.latest_active_time ?? 0,
  //       interactedAddressCount: relatedAddresses.length,
  //       interactedContactCount: 0, // ToDo: (20240122 - Julian) 補上這個欄位
  //       score: addressData.score ?? 0,
  //       reviewData: reviewData,
  //       transactionHistoryData: transactionHistoryData,
  //       transactionCount: transactionHistoryData.length,
  //       blockProducedData: blockProducedData,
  //       flaggingCount: flaggingRecords.length,
  //       riskLevel: 'LOW_RISK', // ToDo: (20240122 - Julian) 補上這個欄位
  //       publicTag: [], // ToDo: (20240122 - Julian) 補上這個欄位
  //     }
  //   : undefined;

  // prisma.$connect();
  // res.status(200).json(result);
  */
}
