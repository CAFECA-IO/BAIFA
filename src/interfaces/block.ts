export interface IBlock {
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

export const dummyBlockData: IBlock[] = [
  {
    id: 265675,
    chainId: 'isun',
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
    chainId: 'isun',
    stabilityLevel: 'HIGH',
    createdTimestamp: 1680998900,
    managementTeam: ['Linda', 'Liam'],
    transactions: [900291],
    miner: '0x1234564890',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 287654,
    chainId: 'eth',
    stabilityLevel: 'MEDIUM',
    createdTimestamp: 16943492374,
    managementTeam: ['Diana', 'Dennis', 'Dylan'],
    transactions: [922372],
    miner: '0x7593284634',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 287655,
    chainId: 'eth',
    stabilityLevel: 'LOW',
    createdTimestamp: 1692860902,
    managementTeam: ['Xavier', 'Xena'],
    transactions: [921372, 922372],
    miner: '0x9393993034',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 287656,
    chainId: 'eth',
    stabilityLevel: 'HIGH',
    createdTimestamp: 1690000902,
    managementTeam: ['Gina', 'Galo'],
    transactions: [928713, 928728],
    miner: '0x3752075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 287326,
    chainId: 'btc',
    stabilityLevel: 'LOW',
    createdTimestamp: 1688734427,
    managementTeam: ['Yolanda', 'Yoda'],
    transactions: [983201],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 287327,
    chainId: 'btc',
    stabilityLevel: 'HIGH',
    createdTimestamp: 1688442795,
    managementTeam: ['Sam', 'Sally', 'Simon'],
    transactions: [983210, 983211],
    miner: '0x9313075232',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 287328,
    chainId: 'btc',
    stabilityLevel: 'MEDIUM',
    createdTimestamp: 1689567791,
    managementTeam: ['Wendy', 'Walter', 'Weston'],
    transactions: [984024, 984025, 984082],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: 287329,
    chainId: 'btc',
    stabilityLevel: 'LOW',
    createdTimestamp: 1689940795,
    managementTeam: ['Quinn', 'Quincy'],
    transactions: [983298],
    miner: '0x2175239304',
    reward: 0.01,
    size: 3.523,
  },
];

export const getDummyBlockData = (chainId: string): IBlock[] => {
  return dummyBlockData.filter(block => block.chainId === chainId);
};
