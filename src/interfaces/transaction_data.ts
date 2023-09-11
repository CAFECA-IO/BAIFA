export interface ITransactionData {
  id: number;
  hash: string;
  status: 'PROCESSING' | 'FAILED' | 'SUCCESS';
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  blockId: number;
  createdTimestamp: number;
  from: string;
  to: string;
  content: string;
  value: number;
  fee: number;
  flagging: boolean;
}

export const dummyTransactionData: ITransactionData[] = [
  {
    id: 934221,
    hash: '0x1234567890',
    type: 'Crypto Currency',
    status: 'PROCESSING',
    blockId: 265675,
    createdTimestamp: 1680978900,
    from: '92830',
    to: '491739',
    content: '345690',
    value: 0.01,
    fee: 0.01,
    flagging: false,
  },
  {
    id: 927413,
    hash: '0x5AbfEc25f74Cd88437631A7731906932776356f1',
    type: 'Evidence',
    status: 'PROCESSING',
    blockId: 211519,
    createdTimestamp: 1690000902,
    from: '99283',
    to: '402839',
    content: '340125',
    value: 0.01,
    fee: 0.01,
    flagging: false,
  },
  {
    id: 928713,
    hash: '0x5AbfEc25f74Cd88437631A7731906932776356f9',
    type: 'NFT',
    status: 'FAILED',
    blockId: 213232,
    createdTimestamp: 1688342795,
    from: '91123',
    to: '412938',
    content: '367845',
    value: 0.01,
    fee: 0.01,
    flagging: true,
  },
  {
    id: 922371,
    hash: '0x5AbfEc25f74Cd88437631A7731906932776356f9',
    type: 'Crypto Currency',
    status: 'SUCCESS',
    blockId: 287654,
    createdTimestamp: 1692342345,
    from: '92830',
    to: '491739',
    content: '390672',
    value: 0.01,
    fee: 0.01,
    flagging: false,
  },
  {
    id: 922371,
    hash: '0x5AbfEc25f74Cd887731906932776437631A356f9',
    type: 'Evidence',
    status: 'SUCCESS',
    blockId: 287654,
    createdTimestamp: 1680022345,
    from: '91290',
    to: '431716',
    content: '389057',
    value: 0.01,
    fee: 0.01,
    flagging: false,
  },
  {
    id: 901833,
    hash: '0x5AbfEc25f74Cd88e37631A7731906932776356f9',
    type: 'Crypto Currency',
    status: 'FAILED',
    blockId: 265675,
    createdTimestamp: 1688312795,
    from: '91103',
    to: '412931',
    content: '301458',
    value: 0.01,
    fee: 0.01,
    flagging: false,
  },
];
