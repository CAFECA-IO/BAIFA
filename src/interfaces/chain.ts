import {IBlock} from './block';
import {IDisplayTransaction} from './transaction';

export interface IChain {
  chainId: string;
  chainName: string;
}

export interface IDisplayChain extends IChain {
  blocks: number;
  transactions: number;
}
export interface IChainDetail extends IChain {
  blockData: IBlock[];
  transactionData: IDisplayTransaction[];
}
