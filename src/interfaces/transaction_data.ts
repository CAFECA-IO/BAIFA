import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';

export interface ITransactionData {
  id: number;
  hash: string;
  status: 'PROCESSING' | 'FAILED' | 'SUCCESS';
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  chainId: string;
  blockId: number;
  createdTimestamp: number;
  from: string;
  to: string;
  content: string;
  value: number;
  fee: number;
  flagging?: IRedFlagType;
}

export const dummyTransactionData: ITransactionData[] = [
  {
    id: 934221,
    hash: '0xE47Dcf8aF9829AD3c4E31409eB6ECfecd046d1BD',
    type: 'NFT',
    status: 'FAILED',
    chainId: 'bolt',
    blockId: 265675,
    createdTimestamp: 1688342795,
    from: '91123',
    to: '412938',
    content: '367845',
    value: 0.01,
    fee: 0.01,
    flagging: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
  },
  {
    id: 931221,
    hash: '0x5AbfEc25f74Cd88437631A7731906932776356f9',
    type: 'Crypto Currency',
    status: 'SUCCESS',
    chainId: 'bolt',
    blockId: 265675,
    createdTimestamp: 1692342345,
    from: '92830',
    to: '491739',
    content: '390672',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: 931291,
    hash: '0xA9ae1A01D7289f0BbBC7A88596EE4f9946f2A058',
    type: 'Evidence',
    status: 'PROCESSING',
    chainId: 'bolt',
    blockId: 265678,
    createdTimestamp: 1689352795,
    from: '98411',
    to: '423867',
    content: '312539',
    value: 0.01,
    fee: 0.01,
    flagging: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_BLACK_LIST',
  },
  {
    id: 931302,
    hash: '0xed13811c38aA7502fc2253f73a2a841Ce6808350',
    type: 'Crypto Currency',
    status: 'FAILED',
    chainId: 'bolt',
    blockId: 265678,
    createdTimestamp: 1687352795,
    from: '98251',
    to: '434127',
    content: '338619',
    value: 0.01,
    fee: 0.01,
    flagging: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_GAMBLING_SITE',
  },
  // {
  //   id: 934221,
  //   hash: '0x1234567890',
  //   type: 'Crypto Currency',
  //   status: 'PROCESSING',
  //   blockId: 265675,
  //   createdTimestamp: 1680978900,
  //   from: '92830',
  //   to: '491739',
  //   content: '345690',
  //   value: 0.01,
  //   fee: 0.01,
  // },
  // {
  //   id: 927413,
  //   hash: '0x5AbfEc25f74Cd88437631A7731906932776356f1',
  //   type: 'Evidence',
  //   status: 'PROCESSING',
  //   blockId: 211519,
  //   createdTimestamp: 1690000902,
  //   from: '99283',
  //   to: '402839',
  //   content: '340125',
  //   value: 0.01,
  //   fee: 0.01,
  // },
  // {
  //   id: 928713,
  //   hash: '0x5AbfEc25f74Cd88437631A7731906932776356f9',
  //   type: 'NFT',
  //   status: 'FAILED',
  //   blockId: 213232,
  //   createdTimestamp: 1688342795,
  //   from: '91123',
  //   to: '412938',
  //   content: '367845',
  //   value: 0.01,
  //   fee: 0.01,
  //   flagging: RedFlagType.MULTIPLE_TRANSFER,
  // },
  // {
  //   id: 922371,
  //   hash: '0x5AbfEc25f74Cd88437631A7731906932776356f9',
  //   type: 'Crypto Currency',
  //   status: 'SUCCESS',
  //   blockId: 287654,
  //   createdTimestamp: 1692342345,
  //   from: '92830',
  //   to: '491739',
  //   content: '390672',
  //   value: 0.01,
  //   fee: 0.01,
  //   flagging: RedFlagType.BLACK_LIST,
  // },
  // {
  //   id: 922372,
  //   hash: '0x5AbfEc25f74Cd887731906932776437631A356f9',
  //   type: 'Evidence',
  //   status: 'SUCCESS',
  //   blockId: 287654,
  //   createdTimestamp: 1680022345,
  //   from: '91290',
  //   to: '431716',
  //   content: '389057',
  //   value: 0.01,
  //   fee: 0.01,
  // },
  // {
  //   id: 901833,
  //   hash: '0x5AbfEc25f74Cd88e37631A7731906932776356f9',
  //   type: 'Crypto Currency',
  //   status: 'FAILED',
  //   blockId: 265675,
  //   createdTimestamp: 1688312795,
  //   from: '91103',
  //   to: '412931',
  //   content: '301458',
  //   value: 0.01,
  //   fee: 0.01,
  //   flagging: RedFlagType.LARGE_WITHDRAW,
  // },
];

export const getTransactionData = (chainId: string): ITransactionData[] => {
  return dummyTransactionData.filter(data => data.chainId === chainId);
};
