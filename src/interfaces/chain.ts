import {IBlock} from './block';
import {ITransaction} from './transaction';

export interface IChain {
  chainId: string;
  chainName: string;
  chainIcon: string;
  blocks: number;
  transactions: number;
}

export interface IChainDetail extends IChain {
  blockData: IBlock[];
  transactionData: ITransaction[];
}

export const dummyChains: IChain[] = [
  {
    chainId: 'isun',
    chainName: 'iSunCloud',
    chainIcon: '/currencies/isun.svg',
    blocks: 213,
    transactions: 123,
  },
  {
    chainId: 'eth',
    chainName: 'Ethereum',
    chainIcon: '/currencies/eth.svg',
    blocks: 2841,
    transactions: 19713,
  },
  {
    chainId: 'btc',
    chainName: 'Bitcoin',
    chainIcon: '/currencies/btc.svg',
    blocks: 5413,
    transactions: 81364,
  },
  {
    chainId: 'usdt',
    chainName: 'Tether',
    chainIcon: '/currencies/usdt.svg',
    blocks: 1355,
    transactions: 13874,
  },
  {
    chainId: 'bnb',
    chainName: 'Binance',
    chainIcon: '/currencies/bnb.svg',
    blocks: 134,
    transactions: 4872,
  },
];
