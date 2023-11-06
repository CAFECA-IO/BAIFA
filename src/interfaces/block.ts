import {IStabilityLevel, StabilityLevel} from '../constants/stability_level';

export interface IBlock {
  id: string;
  chainId: string;
  stabilityLevel: IStabilityLevel;
  createdTimestamp: number;
  managementTeam: string[];
  transactions: string[];
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
    transactions: ['930032', '930071', '931314'],
    miner: '0x1234567890',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '230676',
    chainId: 'isun',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1679998900,
    managementTeam: ['Linda', 'Liam'],
    transactions: ['930291', '931302', '930683'],
    miner: '0x1234564890',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '220087',
    chainId: 'eth',
    stabilityLevel: StabilityLevel.MEDIUM,
    createdTimestamp: 16943492374,
    managementTeam: ['Diana', 'Dennis', 'Dylan'],
    transactions: ['920219', '928728'],
    miner: '0x7593284634',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '221875',
    chainId: 'eth',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1692860902,
    managementTeam: ['Xavier', 'Xena'],
    transactions: ['922372'],
    miner: '0x9393993034',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '228765',
    chainId: 'eth',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1690000902,
    managementTeam: ['Gina', 'Galo'],
    transactions: ['923372', '924713'],
    miner: '0x3752075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '210296',
    chainId: 'btc',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1670734427,
    managementTeam: ['Yolanda', 'Yoda'],
    transactions: ['983201'],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '212039',
    chainId: 'btc',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1688442795,
    managementTeam: ['Sam', 'Sally', 'Simon'],
    transactions: ['912299', '915024'],
    miner: '0x9313075232',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '217328',
    chainId: 'btc',
    stabilityLevel: StabilityLevel.MEDIUM,
    createdTimestamp: 1689567791,
    managementTeam: ['Wendy', 'Walter', 'Weston'],
    transactions: ['913211', '916841'],
    miner: '0x9393075234',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '217329',
    chainId: 'btc',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1689940795,
    managementTeam: ['Quinn', 'Quincy'],
    transactions: ['914025', '918402', '919298'],
    miner: '0x2175239304',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '240505',
    chainId: 'usdt',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1673940795,
    managementTeam: ['Dennis'],
    transactions: ['940202', '940555'],
    miner: '0x2175239304',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '241414',
    chainId: 'usdt',
    stabilityLevel: StabilityLevel.HIGH,
    createdTimestamp: 1673079945,
    managementTeam: ['Hillary', 'Helen'],
    transactions: ['941749', '945008'],
    miner: '0x2175239304',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '241415',
    chainId: 'usdt',
    stabilityLevel: StabilityLevel.MEDIUM,
    createdTimestamp: 1673080400,
    managementTeam: ['Ciara'],
    transactions: ['944777', '944499'],
    miner: '0x2175239304',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '245920',
    chainId: 'usdt',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1673080400,
    managementTeam: ['Forrest', 'Fiona'],
    transactions: ['945449'],
    miner: '0x2175239304',
    reward: 0.01,
    size: 3.523,
  },
  {
    id: '259403',
    chainId: 'bnb',
    stabilityLevel: StabilityLevel.LOW,
    createdTimestamp: 1680407300,
    managementTeam: ['Brenda', 'Bryan'],
    transactions: ['955549'],
    miner: '0x2175239304',
    reward: 0.01,
    size: 3.523,
  },
];

export const getDummyBlockData = (chainId: string): IBlock[] => {
  return dummyBlockData.filter(block => block.chainId === chainId);
};
