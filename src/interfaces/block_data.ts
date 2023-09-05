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
    createdTimestamp: 1640978900,
    managementTeam: ['John Doe', 'Jane Doe'],
    transactions: ['0x1234567890', '0x0987654321'],
    miner: '0x1234567890',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 287654,
    stabilityLevel: 'HIGH',
    createdTimestamp: 1632342345,
    managementTeam: ['Zachary Doe', 'Zoe Doe'],
    transactions: ['0x3849238472', '0x0982348723'],
    miner: '0x9328475634',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 284254,
    stabilityLevel: 'LOW',
    createdTimestamp: 1621592345,
    managementTeam: ['Xavier Doe', 'Xena Doe'],
    transactions: ['0x3849238472', '0x0982348723'],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 213232,
    stabilityLevel: 'LOW',
    createdTimestamp: 1623442795,
    managementTeam: ['Yolanda Doe', 'Yoda Doe'],
    transactions: ['0x3849238472', '0x0982348723'],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 292076,
    stabilityLevel: 'MEDIUM',
    createdTimestamp: 168357791,
    managementTeam: ['Wendy Doe', 'Walter Doe'],
    transactions: ['0x3849238472', '0x0982348723'],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
];
