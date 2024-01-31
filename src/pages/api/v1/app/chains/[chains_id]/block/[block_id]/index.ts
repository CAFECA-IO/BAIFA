// 007 - GET /app/chains/:chain_id/blocks/:block_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';

type ResponseData =
  | {
      id: string;
      chainId: string;
      stability: 'MEDIUM' | 'HIGH' | 'LOW';
      createdTimestamp: number;
      managementTeam: string[];
      transactionCount: number;
      miner: string;
      reward: number;
      unit: string;
      size: number; // bytes
      previousBlockId: string | undefined;
      nextBlockId: string | undefined;
    }
  | undefined;

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

  // Info: (20240119 - Julian) 取得上一個與下一個區塊的編號，如果沒有就 undefined
  const previousBlockNumber = blockData?.number ? `${blockData?.number - 1}` : undefined;
  const nextBlockNumber = blockData?.number ? `${blockData?.number + 1}` : undefined;

  // Info: (20240119 - Julian) 計算 reward
  const rewardRaw = blockData?.reward ? parseInt(blockData?.reward) : 0;
  const reward = rewardRaw / Math.pow(10, decimals);

  // Info: (20240130 - Julian) 日期轉換
  const createdTimestamp = blockData?.created_timestamp
    ? new Date(blockData?.created_timestamp).getDate() / 1000
    : 0;

  const result: ResponseData = blockData
    ? {
        id: `${blockData.number}`,
        chainId: `${blockData.chain_id}`,
        stability: 'HIGH', // ToDo: (20240118 - Julian) 補上這個欄位
        createdTimestamp: createdTimestamp,
        managementTeam: [], // ToDo: (20240118 - Julian) 補上這個欄位
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

  res.status(200).json(result);
}
