import {IBlock, getDummyBlockData} from './block';
import {ITransaction, getDummyTransactionData} from './transaction';

export interface IChain {
  chainId: string;
  chainName: string;
  blocks: number;
  transactions: number;
}

export const dummyChains: IChain[] = [
  {
    chainId: 'isun',
    chainName: 'iSunCloud',
    blocks: 213,
    transactions: 123,
  },
  {
    chainId: 'eth',
    chainName: 'Ethereum',
    blocks: 2841,
    transactions: 19713,
  },
  {
    chainId: 'btc',
    chainName: 'Bitcoin',
    blocks: 5413,
    transactions: 81364,
  },
  {
    chainId: 'usdt',
    chainName: 'Tether',
    blocks: 1355,
    transactions: 13874,
  },
  {
    chainId: 'bnb',
    chainName: 'Binance',
    blocks: 134,
    transactions: 4872,
  },
];
