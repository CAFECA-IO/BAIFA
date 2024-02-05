// 007 - GET /app/chains/:chain_id/blocks/:block_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {IBlockDetail} from '../../../../../../../../interfaces/block';

type ResponseData = IBlockDetail | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240116 - Julian) 解構 URL 參數，同時進行類型轉換
  const block_id =
    typeof req.query.block_id === 'string' ? parseInt(req.query.block_id) : undefined;

  const blockData = await prisma.blocks.findUnique({
    // Info: (20240119 - Julian) 前端傳過來的 block_id 是 number，所以要轉換
    where: {
      number: block_id,
    },
    select: {
      id: true,
      chain_id: true,
      created_timestamp: true,
      transaction_count: true,
      miner: true,
      reward: true,
      size: true,
      number: true,
    },
  });

  // Info: (20240119 - Julian) 從 chains Table 撈出 chain_icon 與 decimals
  const chain_id = blockData?.chain_id ?? 0;
  const chainData = await prisma.chains.findUnique({
    where: {
      id: chain_id,
    },
    select: {
      symbol: true,
      decimals: true,
    },
  });

  const unit = chainData?.symbol ?? '';
  const decimals = chainData?.decimals ?? 0;

  // Info: (20240202 - Julian) 取得上一個區塊的資料
  const previousBlockData = await prisma.blocks.findMany({
    take: -1, // Info: (20240202 - Julian) 代表往前取一筆資料
    skip: 1, // Info: (20240202 - Julian) 代表跳過第一筆資料，也就是 current block
    // Info: (20240202 - Julian) cursor: { id: blockData?.id } 代表取資料的起點，這邊是從 current block 的 id 開始
    cursor: {
      id: blockData?.id,
    },
    select: {
      number: true,
    },
  });
  // Info: (20240119 - Julian) 取得上一個區塊的編號，如果沒有就 undefined
  const previousBlockNumber =
    previousBlockData.length > 0 ? `${previousBlockData[0].number}` : undefined;

  // Info: (20240119 - Julian) 取得下一個區塊的資料
  const nextBlockData = await prisma.blocks.findMany({
    take: 1, // Info: (20240202 - Julian) 代表往後取一筆資料
    skip: 1,
    cursor: {
      id: blockData?.id,
    },
    select: {
      number: true,
    },
  });
  // Info: (20240119 - Julian) 取得下一個區塊的編號，如果沒有就 undefined
  const nextBlockNumber = nextBlockData.length > 0 ? `${nextBlockData[0].number}` : undefined;

  // Info: (20240119 - Julian) 計算 reward
  const rewardRaw = blockData?.reward ? parseInt(blockData?.reward) : 0;
  const reward = rewardRaw / Math.pow(10, decimals);

  const result: ResponseData = blockData
    ? {
        id: `${blockData.number}`,
        chainId: `${blockData.chain_id}`,
        stability: 'HIGH', // ToDo: (20240118 - Julian) 補上這個欄位
        createdTimestamp: blockData.created_timestamp ?? 0,
        extraData: '', // ToDo: (20240118 - Julian) 補上這個欄位
        transactionCount: blockData.transaction_count ?? 0,
        miner: `${blockData.miner}`,
        reward: reward,
        unit: unit,
        size: blockData.size ?? 0,
        previousBlockId: previousBlockNumber,
        nextBlockId: nextBlockNumber,
      }
    : // Info: (20240119 - Julian) 如果沒有找到資料，回傳 undefined
      undefined;

  prisma.$connect();
  res.status(200).json(result);
}
