import {IBlock} from './block';
import {IDisplayTransaction} from './transaction';

export interface IChain {
  chainId: string;
  chainName: string;
  blocks: number;
  transactions: number;
}

export interface IChainDetail extends IChain {
  blockData: IBlock[];
  transactionData: IDisplayTransaction[];
}
