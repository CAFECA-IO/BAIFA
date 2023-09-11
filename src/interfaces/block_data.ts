export interface IBlockData {
  id: number;
  stabilityLevel: 'MEDIUM' | 'HIGH' | 'LOW';
  createdTimestamp: number;
  managementTeam: string[];
  transactions: string[];
  miner: string;
  reward: number;
  size: number;
}

export const dummyBlockData: IBlockData[] = [
  {
    id: 265675,
    stabilityLevel: 'MEDIUM',
    createdTimestamp: 1680978900,
    managementTeam: ['John Doe', 'Jane Doe'],
    transactions: ['0x1234567890', '0x0987654321'],
    miner: '0x1234567890',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 287654,
    stabilityLevel: 'HIGH',
    createdTimestamp: 1692342345,
    managementTeam: ['Zachary Doe', 'Zoe Doe'],
    transactions: ['0x3849238472', '0x0492348723'],
    miner: '0x9328475634',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 284254,
    stabilityLevel: 'LOW',
    createdTimestamp: 1692860902,
    managementTeam: ['Xavier Doe', 'Xena Doe'],
    transactions: ['0x0872348002', '0x0982348723'],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 211519,
    stabilityLevel: 'HIGH',
    createdTimestamp: 1690000902,
    managementTeam: ['George Doe', 'Gina Doe'],
    transactions: ['0x2394048722', '0x0388048723'],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 213232,
    stabilityLevel: 'LOW',
    createdTimestamp: 1673442795,
    managementTeam: ['Yolanda Doe', 'Yoda Doe'],
    transactions: ['0x3923848472', '0x0432879823'],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 202938,
    stabilityLevel: 'HIGH',
    createdTimestamp: 1663442795,
    managementTeam: ['Sam Doe', 'Sally Doe'],
    transactions: ['0x3287298392', '0x0473484823'],
    miner: '0x9313075232',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 292076,
    stabilityLevel: 'MEDIUM',
    createdTimestamp: 1683567791,
    managementTeam: ['Wendy Doe', 'Walter Doe'],
    transactions: ['0x3849238472', '0x0982348723'],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 201832,
    stabilityLevel: 'LOW',
    createdTimestamp: 1692940795,
    managementTeam: ['Quinn Doe', 'Quincy Doe'],
    transactions: ['0x3849238472', '0x0982348723'],
    miner: '0x2175239304',
    reward: 0.01,
    size: 3.523,
  },
];
