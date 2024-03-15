export interface IChain {
  chainId: string;
  chainName: string;
}

export interface IChainDetail extends IChain {
  blocks: number;
  transactions: number;
}

export enum ChainDetailTab {
  BLOCKS = 'blocks',
  TRANSACTIONS = 'transactions',
}
