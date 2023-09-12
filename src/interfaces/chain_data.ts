import {IBlockData, getDummyBlockData} from './block_data';
import {ITransactionData, getTransactionData} from './transaction_data';

export interface IChainData {
  chainId: string;
  chainName: string;
  icon: string;
  blocks: IBlockData[];
  transactions: ITransactionData[];
}

export const dummyChains: IChainData[] = [
  {
    chainId: 'bolt',
    chainName: 'BOLT',
    icon: '/currencies/bolt.svg',
    blocks: getDummyBlockData('bolt'),
    transactions: getTransactionData('bolt'),
  },
  // {
  //   chainId: 'eth',
  //   chainName: 'Ethereum',
  //   icon: '/currencies/ethereum.svg',
  //   blocks: 102000,
  //   transactions: 891402,
  // },
  // {
  //   chainId: 'btc',
  //   chainName: 'Bitcoin',
  //   icon: '/currencies/bitcoin.svg',
  //   blocks: 10053,
  //   transactions: 31294,
  // },
];
