// 011 - GET /app/chains/:chain_id/addresses/:address_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';

type RelatedAddressInfo = {
  id: string;
  chainId: string;
};

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type ReviewData = {
  id: string;
  transactionId: string;
  chainId: string;
  createdTimestamp: number;
  authorAddressId: string;
  content: string;
  stars: number;
};

type TransactionHistoryData = {
  id: string;
  chainId: string;
  createdTimestamp: number;
  from: AddressInfo[];
  to: AddressInfo[];
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
};

type BlockProducedData = {
  id: string;
  createdTimestamp: number;
  stability: 'LOW' | 'MEDIUM' | 'HIGH';
  reward: number;
  unit: string;
};

type ResponseData =
  | {
      id: string;
      type: string;
      address: string;
      chainId: string;
      createdTimestamp: number;
      latestActiveTime: number;
      relatedAddresses: RelatedAddressInfo[];
      interactedAddressCount: number;
      interactedContactCount: number;
      score: number;
      reviewData: ReviewData[];
      transactionHistoryData: TransactionHistoryData[];
      blockProducedData: BlockProducedData[];
      flaggingCount: number;
      riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
      publicTag: string[];
    }
  | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240122 - Julian) 解構 URL 參數，同時進行類型轉換
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;

  // Info: (20240122 - Julian) -------------- 透過 addresses Table 找出 address_id 的資料 --------------
  const addressData = await prisma.addresses.findUnique({
    where: {
      address: address_id,
    },
    select: {
      id: true,
      chain_id: true,
      created_timestamp: true,
      address: true,
      score: true,
      latest_active_time: true,
    },
  });

  const chainData = await prisma.chains.findUnique({
    where: {
      id: addressData?.chain_id ?? undefined,
    },
    select: {
      symbol: true,
      decimals: true,
    },
  });

  const unit = chainData?.symbol ? chainData.symbol : '';
  const decimals = chainData?.decimals ? chainData.decimals : 0;

  // Info: (20240122 - Julian) -------------- 在 transactions Table 找出所有與 address_id 相關的交易 --------------
  // SELECT * FROM transactions WHERE related_addresses LIKE '%address_id%'
  const transactionData = address_id
    ? await prisma.transactions.findMany({
        where: {
          related_addresses: {
            hasSome: [address_id],
          },
        },
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
      })
    : [];

  // Info: (20240122 - Julian) ================== transactionHistoryData ==================
  const transactionHistoryData: TransactionHistoryData[] = transactionData.map(transaction => {
    // Info: (20240130 - Julian) 日期轉換
    const transactionTimestamp = transaction.created_timestamp
      ? new Date(transaction.created_timestamp).getTime() / 1000
      : 0;

    // Info: (20240130 - Julian) from address 轉換
    const fromAddresses = transaction.from_address ? transaction.from_address.split(',') : [];
    const from: AddressInfo[] = fromAddresses
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
    const to: AddressInfo[] = toAddresses
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
      createdTimestamp: transactionTimestamp,
      from: from,
      to: to,
      type: 'Crypto Currency', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 type 的轉換
      status: 'PENDING', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 status 的轉換
    };
  });

  // Info: (20240122 - Julian) 透過 transactions Table 的 related_addresses 欄位找出所有相關的 address
  const relatedAddressesRaw = transactionData.flatMap(transaction => {
    // Info: (20240131 - Julian) 過濾掉 null 和 address_id
    return transaction.related_addresses.filter(
      address => address !== address_id && address !== 'null'
    );
  });
  // Info: (20240131 - Julian) 過濾重複的 address
  const relatedAddresses = Array.from(new Set(relatedAddressesRaw));

  // Info: (20240122 - Julian) ================== blockProducedData ==================
  const blockData = address_id
    ? await prisma.blocks.findMany({
        where: {
          miner: address_id,
        },
        select: {
          id: true,
          created_timestamp: true,
          reward: true,
        },
      })
    : [];

  const blockProducedData: BlockProducedData[] = blockData.map(block => {
    // Info: (20240130 - Julian) 日期轉換
    const blockCreatedTimestamp = block.created_timestamp
      ? new Date(block.created_timestamp).getTime() / 1000
      : 0;

    // Info: (20240130 - Julian) reward 轉換
    const rewardRaw = block.reward ? parseInt(block.reward) : 0;
    const reward = rewardRaw / Math.pow(10, decimals);

    return {
      id: `${block.id}`,
      createdTimestamp: blockCreatedTimestamp,
      stability: 'MEDIUM', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 stability 的轉換
      reward: reward,
      unit: unit,
    };
  });

  // Info: (20240130 - Julian) ================== reviewData ==================
  const reviewDataRaw = await prisma.review_datas.findMany({
    where: {
      target: address_id,
    },
    select: {
      id: true,
      created_timestamp: true,
      author_address: true,
      content: true,
      stars: true,
    },
  });
  const reviewData: ReviewData[] = reviewDataRaw.map(review => {
    const reviewTimestamp = review.created_timestamp
      ? new Date(review.created_timestamp).getTime() / 1000
      : 0;

    return {
      id: `${review.id}`,
      transactionId: `${review.id}`,
      chainId: `${review.id}`,
      createdTimestamp: reviewTimestamp,
      authorAddressId: `${review.author_address}`,
      content: `${review.content}`,
      stars: review.stars ?? 0,
    };
  });

  // Info: (20240130 - Julian) ================== flaggingCount ==================
  const flaggingRecords = await prisma.red_flags.findMany({
    where: {
      related_addresses: {
        hasSome: [`${address_id}`],
      },
    },
    select: {
      id: true,
    },
  });

  // Info: (20240130 - Julian) 日期轉換
  const addressCreatedTimestamp = addressData?.created_timestamp
    ? new Date(addressData?.created_timestamp).getTime() / 1000
    : 0;
  const addressLatestActiveTime = addressData?.latest_active_time
    ? new Date(addressData?.latest_active_time).getTime() / 1000
    : 0;

  const result: ResponseData = addressData
    ? {
        id: `${addressData.id}`,
        type: 'address',
        address: `${addressData.address}`,
        chainId: `${addressData.chain_id}`,
        createdTimestamp: addressCreatedTimestamp,
        latestActiveTime: addressLatestActiveTime,
        relatedAddresses: [], // ToDo: (20240122 - Julian) 可能廢除
        interactedAddressCount: relatedAddresses.length,
        interactedContactCount: 0, // ToDo: (20240122 - Julian) 補上這個欄位
        score: addressData.score ?? 0,
        reviewData: reviewData,
        transactionHistoryData: transactionHistoryData,
        blockProducedData: blockProducedData,
        flaggingCount: flaggingRecords.length,
        riskLevel: 'LOW_RISK', // ToDo: (20240122 - Julian) 補上這個欄位
        publicTag: [], // ToDo: (20240122 - Julian) 補上這個欄位
      }
    : undefined;

  res.status(200).json(result);
}
