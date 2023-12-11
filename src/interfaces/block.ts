import {IStabilityLevel, StabilityLevel} from '../constants/stability_level';

export interface IBlock {
  id: string;
  chainId: string;
  stabilityLevel: IStabilityLevel;
  createdTimestamp: number;
  managementTeam: string[];
  transactionCount: number;
  miner: string;
  reward: number;
  size: number;
}

export const dummyBlockData: IBlock[] = [
  {
    id: '230021',
    chainId: 'isun',
    stabilityLevel: StabilityLevel.MEDIUM,
    createdTimestamp: 1679978900,
    managementTeam: ['John', 'Jane', 'Jack'],
    transactionCount: 3,
    miner: '0x1234567890',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '230676',
    chainId: 'isun',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1679998900,
    managementTeam: ['Linda', 'Liam'],
    transactionCount: 3,
    miner: '0x1234564890',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '220087',
    chainId: 'eth',
    stabilityLevel: StabilityLevel.MEDIUM,
    createdTimestamp: 16943492374,
    managementTeam: ['Diana', 'Dennis', 'Dylan'],
    transactionCount: 2,
    miner: '0x7593284634',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '221875',
    chainId: 'eth',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1692860902,
    managementTeam: ['Xavier', 'Xena'],
    transactionCount: 1,
    miner: '0x9393993034',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '228765',
    chainId: 'eth',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1690000902,
    managementTeam: ['Gina', 'Galo'],
    transactionCount: 2,
    miner: '0x3752075234',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '210296',
    chainId: 'btc',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1670734427,
    managementTeam: ['Yolanda', 'Yoda'],
    transactionCount: 1,
    miner: '0x9393075234',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '212039',
    chainId: 'btc',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1688442795,
    managementTeam: ['Sam', 'Sally', 'Simon'],
    transactionCount: 2,
    miner: '0x9313075232',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '217328',
    chainId: 'btc',
    stabilityLevel: StabilityLevel.MEDIUM,
    createdTimestamp: 1689567791,
    managementTeam: ['Wendy', 'Walter', 'Weston'],
    transactionCount: 2,
    miner: '0x9393075234',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '217329',
    chainId: 'btc',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1689940795,
    managementTeam: ['Quinn', 'Quincy'],
    transactionCount: 3,
    miner: '0x2175239304',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '240505',
    chainId: 'usdt',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1673940795,
    managementTeam: ['Dennis'],
    transactionCount: 2,
    miner: '0x2175239304',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '241414',
    chainId: 'usdt',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1673079945,
    managementTeam: ['Hillary', 'Helen'],
    transactionCount: 2,
    miner: '0x2175239304',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '241415',
    chainId: 'usdt',
    stabilityLevel: StabilityLevel.MEDIUM,
    createdTimestamp: 1673080400,
    managementTeam: ['Ciara'],
    transactionCount: 2,
    miner: '0x2175239304',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '245920',
    chainId: 'usdt',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1673080400,
    managementTeam: ['Forrest', 'Fiona'],
    transactionCount: 1,
    miner: '0x2175239304',
    reward: 0.01,
    size: 3523,
  },
  {
    id: '259403',
    chainId: 'bnb',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1680407300,
    managementTeam: ['Brenda', 'Bryan'],
    transactionCount: 1,
    miner: '0x2175239304',
    reward: 0.01,
    size: 3523,
  },
];

export const getDummyBlockData = (chainId: string): IBlock[] => {
  return dummyBlockData.filter(block => block.chainId === chainId);
};
