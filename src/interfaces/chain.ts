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
