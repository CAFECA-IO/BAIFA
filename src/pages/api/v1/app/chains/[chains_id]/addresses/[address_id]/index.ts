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
  chainIcon: string;
};

type ResponseData = {
  id: string;
  type: string;
  address: string;
  chainId: string;
  chainIcon: string;
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
};

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
      id: addressData?.chain_id,
    },
    select: {
      chain_icon: true,
    },
  });

  const chainIcon = chainData?.chain_icon ? chainData.chain_icon : '';

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
          type: true,
          status: true,
          created_timestamp: true,
          related_addresses: true,
        },
      })
    : [];

  // Info: (20240122 - Julian) 將 transactionData 轉換成 transactionHistoryData 格式
  const transactionHistoryData: TransactionHistoryData[] = transactionData.map(transaction => {
    const from: AddressInfo[] = [];
    const to: AddressInfo[] = [];
    transaction.related_addresses.forEach(address => {
      if (address !== address_id && address !== 'null') {
        from.push({
          type: 'address',
          address: address,
        });
      } else if (address !== 'null') {
        to.push({
          type: 'address',
          address: address,
        });
      }
    });

    return {
      id: `${transaction.id}`,
      chainId: `${transaction.chain_id}`,
      createdTimestamp: new Date(transaction.created_timestamp).getTime() / 1000,
      from: from,
      to: to,
      type: 'Crypto Currency', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 type 的轉換
      status: 'PENDING', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 status 的轉換
    };
  });

  // Info: (20240122 - Julian) 透過 transactions Table 的 related_addresses 欄位找出所有相關的 address
  const relatedAddresses: string[] = [];
  transactionData.forEach(transaction => {
    transaction.related_addresses.forEach(address => {
      if (address !== address_id && address !== 'null' && !relatedAddresses.includes(address)) {
        relatedAddresses.push(address);
      }
    });
  });

  // Info: (20240122 - Julian) -------------- 在 blocks Table 找出所有與 address_id 相關的區塊 --------------
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
    return {
      id: `${block.id}`,
      createdTimestamp: new Date(block.created_timestamp).getTime() / 1000,
      stability: 'MEDIUM', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 stability 的轉換
      reward: block.reward,
      unit: 'isun', // ToDo: (20240124 - Julian) 需要參考 codes Table 並補上 unit 的轉換
      chainIcon: chainIcon,
    };
  });

  const result: ResponseData = addressData
    ? {
        id: `${addressData.id}`,
        type: 'address',
        address: addressData.address,
        chainId: `${addressData.chain_id}`,
        chainIcon: chainIcon,
        createdTimestamp: new Date(addressData.created_timestamp).getTime() / 1000,
        latestActiveTime: new Date(addressData.latest_active_time).getTime() / 1000,
        relatedAddresses: [], // ToDo: (20240122 - Julian) 可能廢除
        interactedAddressCount: relatedAddresses.length,
        interactedContactCount: 0, // ToDo: (20240122 - Julian) 補上這個欄位
        score: addressData.score,
        reviewData: [], // ToDo: (20240122 - Julian) 補上這個欄位
        transactionHistoryData: transactionHistoryData,
        blockProducedData: blockProducedData,
        flaggingCount: 0, // ToDo: (20240122 - Julian) 補上這個欄位
        riskLevel: 'LOW_RISK', // ToDo: (20240122 - Julian) 補上這個欄位
        publicTag: [], // ToDo: (20240122 - Julian) 補上這個欄位
      }
    : {
        id: '',
        type: '',
        address: '',
        chainId: '',
        chainIcon: '',
        createdTimestamp: 0,
        latestActiveTime: 0,
        relatedAddresses: [],
        interactedAddressCount: 0,
        interactedContactCount: 0,
        score: 0,
        reviewData: [],
        transactionHistoryData: [],
        blockProducedData: [],
        flaggingCount: 0,
        riskLevel: 'LOW_RISK',
        publicTag: [],
      };

  res.status(200).json(result);

  /*   
  const result: ResponseData = {
    'id': '110132',
    'type': 'address',
    'address': '0x2775D3190693fEc256d156f9f74Cd8843A79',
    'chainId': 'btc',
    'chainIcon': '/currencies/isun.svg',
    'createdTimestamp': 1680827461,
    'latestActiveTime': 1682935384,
    'relatedAddresses': [
      {
        'id': '214134',
        'chainId': 'btc',
      },
      {
        'id': '234143',
        'chainId': 'eth',
      },
      // ...
    ],
    'interactedAddressCount': 3,
    'interactedContactCount': 2,
    'score': 2.8,
    'reviewData': [
      {
        'id': 'T93015400001',
        'transactionId': '930154',
        'chainId': 'btc',
        'createdTimestamp': 1689352795,
        'authorAddressId': '324801',
        'content': 'This is a review',
        'stars': 3,
      },
      {
        'id': 'T93015400002',
        'transactionId': '930154',
        'chainId': 'btc',
        'createdTimestamp': 1689752690,
        'authorAddressId': '327923',
        'content': 'This is a review',
        'stars': 3,
      },
      //...
    ],
    'transactionHistoryData': [
      {
        'id': '918402',
        'chainId': 'btc',
        'createdTimestamp': 1679978987,
        'from': [{'type': 'address', 'address': '114007'}], // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        'to': [{'type': 'contract', 'address': '110132'}],
        'type': 'Evidence',
        'status': 'SUCCESS',
      },
      {
        'id': '912299',
        'chainId': 'btc',
        'createdTimestamp': 1687909392,
        'from': [{'type': 'address', 'address': '110132'}], // FIXME:address like 0x356f9537631A773Ab9069fEc25f74Cd884132776
        'to': [{'type': 'contract', 'address': '310683'}],
        'type': 'Evidence',
        'status': 'FAILED',
      },
      //...
    ],
    'blockProducedData': [
      {
        'id': '217328',
        'createdTimestamp': 1678940724,
        'stability': 'MEDIUM',
        'reward': 2.4,
        'unit': 'btc',
        'chainIcon': '/currencies/btc.svg',
      },
      {
        'id': '217329',
        'createdTimestamp': 1684176283,
        'stability': 'LOW',
        'reward': 2.4,
        'unit': 'btc',
        'chainIcon': '/currencies/btc.svg',
      },
      //...
    ],
    'flaggingCount': 23,
    'riskLevel': 'MEDIUM_RISK',
    'publicTag': ['PUBLIC_TAG.UNKNOWN_USER'],
  };

  res.status(200).json(result); */
}
