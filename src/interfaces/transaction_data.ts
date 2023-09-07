export interface ITransactionData {
  id: number;
  hash: string;
  status: 'PENDING' | 'FAILED' | 'SUCCESS';
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
    status: 'PENDING',
    blockId: 265675,
    createdTimestamp: 1680978900,
    from: '92830',
    to: '491739',
    content: '0x1234567890',
    value: 0.01,
    fee: 0.01,
    flagging: false,
  },
  {
    id: 927413,
    hash: '0x5AbfEc25f74Cd88437631A7731906932776356f1',
    type: 'Evidence',
    status: 'PENDING',
    blockId: 211519,
    createdTimestamp: 1690000902,
    from: '99283',
    to: '402839',
    content: '0x1234567890',
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
    content: '0x1234567890',
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
    content: '0x1234567890',
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
    content: '0x1234567890',
    value: 0.01,
    fee: 0.01,
    flagging: false,
  },
];
