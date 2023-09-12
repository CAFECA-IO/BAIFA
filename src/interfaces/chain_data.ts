import {IBlockData, getDummyBlockData} from './block_data';
import {ITransactionData, getDummyTransactionData} from './transaction_data';

export interface IChainData {
  chainId: string;
  chainName: string;
  blocks: IBlockData[];
  transactions: ITransactionData[];
}

export const dummyChains: IChainData[] = [
  {
    chainId: 'bolt',
    chainName: 'BOLT',
    blocks: getDummyBlockData('bolt'),
    transactions: getDummyTransactionData('bolt'),
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
