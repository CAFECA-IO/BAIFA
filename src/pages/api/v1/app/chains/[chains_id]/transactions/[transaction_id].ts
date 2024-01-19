// 010 - GET /app/chains/:chain_id/transactions/:transaction_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../lib/utils/prismaUtils';

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type FlaggingRecords = {
  redFlagId: string;
  redFlagType: string;
};

type ResponseData = {
  id: string;
  hash: string;
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING';
  chainId: string;
  chainIcon: string;
  blockId: string;
  createdTimestamp: number;
  from: AddressInfo[];
  to: AddressInfo[];
  evidenceId: string;
  value: number;
  fee: number;
  unit: string;
  flaggingRecords: FlaggingRecords[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240116 - Julian) 解構 URL 參數，同時進行類型轉換
  const transaction_id =
    typeof req.query.transaction_id === 'string' ? parseInt(req.query.transaction_id) : undefined;

  const transactionData = await prisma.transactions.findUnique({
    where: {
      id: transaction_id,
    },
    select: {
      id: true,
      hash: true,
      type: true,
      status: true,
      chain_id: true,
      block_hash: true,
      created_timestamp: true,
      from_address: true,
      to_address: true,
      // ToDo: (20240119 - Julian) 目前 DB 裡這欄是 null，所以先註解掉
      //evidence_id: true,
      value: true,
      fee: true,
    },
  });

  // Info: (20240119 - Julian) 從 chains Table 撈出 chain_icon
  const chain_id = transactionData?.chain_id ?? 0;
  const chainData = await prisma.chains.findUnique({
    where: {
      id: chain_id,
    },
    select: {
      chain_icon: true,
    },
  });
  const chainIcon = chainData?.chain_icon ?? '';

  // Info: (20240119 - Julian) 從 blocks Table 撈出 block_id
  const blockHash = transactionData?.block_hash ?? '';
  const blockData = await prisma.blocks.findFirst({
    where: {
      hash: blockHash,
    },
    select: {
      number: true,
    },
  });
  const blockId = `${blockData?.number}` ?? '';

  const fee = transactionData ? parseInt(`${transactionData.fee}`) : 0;

  // Info: (20240119 - Julian) 轉換成 API 要的格式
  const result: ResponseData = transactionData
    ? {
        id: `${transactionData.id}`,
        hash: transactionData.hash,
        type: 'Crypto Currency', // ToDo: (20240119 - Julian) 須參考 codes Table 並補上 type 的轉換
        status: 'SUCCESS', // ToDo: (20240119 - Julian) 須參考 codes Table 並補上 status 的轉換
        chainId: `${transactionData.chain_id}`,
        chainIcon: chainIcon,
        blockId: blockId,
        createdTimestamp: transactionData.created_timestamp.getTime() / 1000,
        from: [
          {
            type: 'address', // ToDo: (20240119 - Julian) 先寫死，等待後續補上 contract
            address: transactionData.from_address,
          },
        ],
        to: [
          {
            type: 'address', // ToDo: (20240119 - Julian) 先寫死，等待後續補上 contract
            address: transactionData.to_address,
          },
        ],
        evidenceId: '1390', // ToDo: (20240119 - Julian) 補上這個欄位
        value: transactionData.value,
        fee: fee,
        unit: 'isun', // ToDo: (20240119 - Julian) 補上這個欄位
        flaggingRecords: [], // ToDo: (20240119 - Julian) 補上這個欄位
      }
    : {
        id: '',
        hash: '',
        type: 'Crypto Currency',
        status: 'SUCCESS',
        chainId: '',
        chainIcon: '',
        blockId: '',
        createdTimestamp: 0,
        from: [],
        to: [],
        evidenceId: '',
        value: 0,
        fee: 0,
        unit: '',
        flaggingRecords: [],
      };

  res.status(200).json(result);

  /* 
  const result: ResponseData = {
    'id': '930071',
    'hash': '0xE47Dcf8aF9829AD3c4E31409eB6ECfecd046d1BD',
    'type': 'NFT',
    'status': 'PROCESSING',
    'chainId': 'isun',
    'chainIcon': '/currencies/isun.svg',
    'blockId': '230021',
    'createdTimestamp': 1688342795,
    'from': [{'type': 'address', 'address': '130294'}],
    'to': [{'type': 'contract', 'address': '310071'}],
    'evidenceId': '530029',
    'value': 0.01,
    'fee': 0.01,
    'unit': 'ETH',
    'flaggingRecords': [
      {
        'redFlagId': '1378976701',
        'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_DEPOSIT',
      },
    ],
  };

  res.status(200).json(result); */
}
