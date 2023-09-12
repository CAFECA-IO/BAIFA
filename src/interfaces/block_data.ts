export interface IBlockData {
  id: number;
  chainId: string;
  stabilityLevel: 'MEDIUM' | 'HIGH' | 'LOW';
  createdTimestamp: number;
  managementTeam: string[];
  transactions: number[];
  miner: string;
  reward: number;
  size: number;
}

export const dummyBlockData: IBlockData[] = [
  {
    id: 265675,
    chainId: 'bolt',
    stabilityLevel: 'MEDIUM',
    createdTimestamp: 1680978900,
    managementTeam: ['John', 'Jane', 'Jack'],
    transactions: [934221, 931221],
    miner: '0x1234567890',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 265676,
    chainId: 'bolt',
    stabilityLevel: 'HIGH',
    createdTimestamp: 1680998900,
    managementTeam: ['Linda', 'Liam'],
    transactions: [900291],
    miner: '0x1234564890',
    reward: 0.01,
    size: 3.523,
  } /* ,
  {
    id: 287654,
    stabilityLevel: 'HIGH',
    createdTimestamp: 1692342345,
    managementTeam: ['Zachary'],
    transactions: [922371, 922372],
    miner: '0x9328475634',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 284254,
    stabilityLevel: 'LOW',
    createdTimestamp: 1692860902,
    managementTeam: ['Xavier', 'Xena'],
    transactions: [],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 211519,
    stabilityLevel: 'HIGH',
    createdTimestamp: 1690000902,
    managementTeam: ['George', 'Gina', 'Galo'],
    transactions: [927413],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 213232,
    stabilityLevel: 'LOW',
    createdTimestamp: 1673442795,
    managementTeam: ['Yolanda', 'Yoda'],
    transactions: [928713],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 202938,
    stabilityLevel: 'HIGH',
    createdTimestamp: 1663442795,
    managementTeam: ['Sam', 'Sally', 'Simon'],
    transactions: [],
    miner: '0x9313075232',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 292076,
    stabilityLevel: 'MEDIUM',
    createdTimestamp: 1683567791,
    managementTeam: ['Wendy', 'Walter', 'Weston'],
    transactions: [],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 201832,
    stabilityLevel: 'LOW',
    createdTimestamp: 1692940795,
    managementTeam: ['Quinn', 'Quincy'],
    transactions: [],
    miner: '0x2175239304',
    reward: 0.01,
    size: 3.523,
  }, */,
];

export const getDummyBlockData = (chainId: string): IBlockData[] => {
  return dummyBlockData.filter(block => block.chainId === chainId);
};
