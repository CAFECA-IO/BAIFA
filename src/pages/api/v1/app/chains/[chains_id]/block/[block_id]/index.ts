// 007 - GET /app/chains/:chain_id/blocks/:block_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';

type ResponseData = {
  id: string;
  chainId: string;
  chainIcon: string;
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
};

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

  // Info: (20240119 - Julian) 從 chains Table 撈出 chain_icon
  const chain_id = blockData?.chain_id ?? 0;
  const chainData = await prisma.chains.findUnique({
    where: {
      id: chain_id,
    },
    select: {
      chain_icon: true,
    },
  });
  const chainIcon = chainData?.chain_icon ?? '';

  // Info: (20240119 - Julian) 取得上一個與下一個區塊的編號，如果沒有就 undefined
  const previousBlockNumber = blockData?.number ? `${blockData?.number - 1}` : undefined;
  const nextBlockNumber = blockData?.number ? `${blockData?.number + 1}` : undefined;

  const result: ResponseData = blockData
    ? {
        id: `${blockData.number}`,
        chainId: `${blockData.chain_id}`,
        chainIcon: chainIcon,
        stability: 'HIGH', // ToDo: (20240118 - Julian) 補上這個欄位
        createdTimestamp: blockData.created_timestamp.getTime() / 1000,
        managementTeam: ['Alice', 'Bob', 'Charlie'], // ToDo: (20240118 - Julian) 補上這個欄位
        transactionCount: blockData.transaction_count,
        miner: blockData.miner,
        reward: blockData.reward,
        unit: 'isun', // ToDo: (20240118 - Julian) 補上這個欄位
        size: blockData.size,
        previousBlockId: previousBlockNumber,
        nextBlockId: nextBlockNumber,
      }
    : {
        id: '',
        chainId: '',
        chainIcon: '',
        stability: 'HIGH',
        createdTimestamp: 0,
        managementTeam: [],
        transactionCount: 0,
        miner: '',
        reward: 0,
        unit: '',
        size: 0,
        previousBlockId: '',
        nextBlockId: '',
      };

  res.status(200).json(result);
}
