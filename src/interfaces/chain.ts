export interface IChain {
  chainId: string;
  chainName: string;
}

export interface IChainDetail extends IChain {
  blocks: number;
  transactions: number;
}
