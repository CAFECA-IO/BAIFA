import {IBlock, getDummyBlockData} from './block';
import {ITransactionData, getDummyTransactionData} from './transaction_data';

export interface IChain {
  chainId: string;
  chainName: string;
  blocks: IBlock[];
  transactions: ITransactionData[];
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
];
