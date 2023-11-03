import {IBlock, getDummyBlockData} from './block';
import {ITransaction, getDummyTransactionData} from './transaction';

export interface IChain {
  chainId: string;
  chainName: string;
  blocks: IBlock[];
  transactions: ITransaction[];
}

export const dummyChains: IChain[] = [
  {
    chainId: 'isun',
    chainName: 'iSunCloud',
    blocks: getDummyBlockData('isun'),
    transactions: getDummyTransactionData('isun'),
  },
  {
    chainId: 'eth',
    chainName: 'Ethereum',
    blocks: getDummyBlockData('eth'),
    transactions: getDummyTransactionData('eth'),
  },
  {
    chainId: 'btc',
    chainName: 'Bitcoin',
    blocks: getDummyBlockData('btc'),
    transactions: getDummyTransactionData('btc'),
  },
  {
    chainId: 'usdt',
    chainName: 'Tether',
    blocks: getDummyBlockData('usdt'),
    transactions: getDummyTransactionData('usdt'),
  },
  {
    chainId: 'bnb',
    chainName: 'Binance',
    blocks: getDummyBlockData('bnb'),
    transactions: getDummyTransactionData('bnb'),
  },
];
