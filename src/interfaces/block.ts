import {IStabilityLevel, StabilityLevel} from '../constants/stability_level';

export interface IBlock {
  id: string;
  chainId: string;
  stability: IStabilityLevel;
  createdTimestamp: number;
}

export interface IProductionBlock extends IBlock {
  reward: number;
  unit: string;
  chainIcon: string;
}

export interface IBlockDetail extends IBlock {
  managementTeam: string[];
  transactionCount: number;
  miner: string;
  reward: number;
  unit: string;
  size: number;
  previousBlockId: string;
  nextBlockId: string;
}

export const dummyBlockData: IBlockDetail[] = [
  {
    id: '230021',
    chainId: 'isun',
    stability: StabilityLevel.MEDIUM,
    createdTimestamp: 1679978900,
    managementTeam: ['John', 'Jane', 'Jack'],
    transactionCount: 3,
    miner: '0x1234567890',
    reward: 0.01,
    unit: 'isun',
    size: 3523,
    previousBlockId: '230020',
    nextBlockId: '230022',
  },
  {
    id: '230676',
    chainId: 'isun',
    stability: StabilityLevel.HIGH,
    createdTimestamp: 1679998900,
    managementTeam: ['Linda', 'Liam'],
    transactionCount: 3,
    miner: '0x1234564890',
    reward: 0.01,
    unit: 'isun',
    size: 3523,
    previousBlockId: '230675',
    nextBlockId: '230677',
  },
  {
    id: '220087',
    chainId: 'eth',
    stability: StabilityLevel.MEDIUM,
    createdTimestamp: 16943492374,
    managementTeam: ['Diana', 'Dennis', 'Dylan'],
    transactionCount: 2,
    miner: '0x7593284634',
    reward: 0.01,
    unit: 'eth',
    size: 3523,
    previousBlockId: '220086',
    nextBlockId: '220088',
  },
  {
    id: '221875',
    chainId: 'eth',
    stability: StabilityLevel.LOW,
    createdTimestamp: 1692860902,
    managementTeam: ['Xavier', 'Xena'],
    transactionCount: 1,
    miner: '0x9393993034',
    reward: 0.01,
    unit: 'eth',
    size: 3523,
    previousBlockId: '221874',
    nextBlockId: '221876',
  },
  {
    id: '228765',
    chainId: 'eth',
    stability: StabilityLevel.HIGH,
    createdTimestamp: 1690000902,
    managementTeam: ['Gina', 'Galo'],
    transactionCount: 2,
    miner: '0x3752075234',
    reward: 0.01,
    unit: 'eth',
    size: 3523,
    previousBlockId: '228764',
    nextBlockId: '228766',
  },
  {
    id: '210296',
    chainId: 'btc',
    stability: StabilityLevel.LOW,
    createdTimestamp: 1670734427,
    managementTeam: ['Yolanda', 'Yoda'],
    transactionCount: 1,
    miner: '0x9393075234',
    reward: 0.01,
    unit: 'btc',
    size: 3523,
    previousBlockId: '210295',
    nextBlockId: '210297',
  },
  {
    id: '212039',
    chainId: 'btc',
    stability: StabilityLevel.HIGH,
    createdTimestamp: 1688442795,
    managementTeam: ['Sam', 'Sally', 'Simon'],
    transactionCount: 2,
    miner: '0x9313075232',
    reward: 0.01,
    unit: 'btc',
    size: 3523,
    previousBlockId: '212038',
    nextBlockId: '212040',
  },
  {
    id: '217328',
    chainId: 'btc',
    stability: StabilityLevel.MEDIUM,
    createdTimestamp: 1689567791,
    managementTeam: ['Wendy', 'Walter', 'Weston'],
    transactionCount: 2,
    miner: '0x9393075234',
    reward: 0.01,
    unit: 'btc',
    size: 3523,
    previousBlockId: '217327',
    nextBlockId: '217329',
  },
  {
    id: '217329',
    chainId: 'btc',
    stability: StabilityLevel.LOW,
    createdTimestamp: 1689940795,
    managementTeam: ['Quinn', 'Quincy'],
    transactionCount: 3,
    miner: '0x2175239304',
    reward: 0.01,
    unit: 'btc',
    size: 3523,
    previousBlockId: '217328',
    nextBlockId: '217330',
  },
  {
    id: '240505',
    chainId: 'usdt',
    stability: StabilityLevel.HIGH,
    createdTimestamp: 1673940795,
    managementTeam: ['Dennis'],
    transactionCount: 2,
    miner: '0x2175239304',
    reward: 0.01,
    unit: 'usdt',
    size: 3523,
    previousBlockId: '240504',
    nextBlockId: '240506',
  },
  {
    id: '241414',
    chainId: 'usdt',
    stability: StabilityLevel.HIGH,
    createdTimestamp: 1673079945,
    managementTeam: ['Hillary', 'Helen'],
    transactionCount: 2,
    miner: '0x2175239304',
    reward: 0.01,
    unit: 'usdt',
    size: 3523,
    previousBlockId: '241413',
    nextBlockId: '241415',
  },
  {
    id: '241415',
    chainId: 'usdt',
    stability: StabilityLevel.MEDIUM,
    createdTimestamp: 1673080400,
    managementTeam: ['Ciara'],
    transactionCount: 2,
    miner: '0x2175239304',
    reward: 0.01,
    unit: 'usdt',
    size: 3523,
    previousBlockId: '241414',
    nextBlockId: '241416',
  },
  {
    id: '245920',
    chainId: 'usdt',
    stability: StabilityLevel.LOW,
    createdTimestamp: 1673080400,
    managementTeam: ['Forrest', 'Fiona'],
    transactionCount: 1,
    miner: '0x2175239304',
    reward: 0.01,
    unit: 'usdt',
    size: 3523,
    previousBlockId: '245919',
    nextBlockId: '245921',
  },
  {
    id: '259403',
    chainId: 'bnb',
    stability: StabilityLevel.LOW,
    createdTimestamp: 1680407300,
    managementTeam: ['Brenda', 'Bryan'],
    transactionCount: 1,
    miner: '0x2175239304',
    reward: 0.01,
    unit: 'bnb',
    size: 3523,
    previousBlockId: '259402',
    nextBlockId: '259404',
  },
];

export const getDummyBlockData = (chainId: string): IBlock[] => {
  return dummyBlockData.filter(block => block.chainId === chainId);
};
