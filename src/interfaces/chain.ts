export interface IChainStat {
  label: string;
  value: string;
  change?: string;
  subValue?: string; // Info: (20260130 - Julian) For incremental values like +502,245
  isNegative?: boolean;
}

export interface IDetailedStats {
  transactions: IChainStat[];
  addresses: IChainStat[];
  tokens: IChainStat[];
  overview: IChainStat[];
}

// Info: (20260130 - Julian) ... existing interfaces
export interface IBlock {
  height: string;
  time: string; // Info: (20260130 - Julian) Elapsed time (e.g. 12s ago)
  timestamp: string; // Info: (20260130 - Julian) Full date/time
  proposer: string;
  proposerLabel?: string;
  txns: number;
  reward: string;
  gas: string; // Info: (20260130 - Julian) Gas price or similar summary
  size: string;
  gasUsed: string;
  gasUsedPercent: number;
  gasLimit: string;
  gasPrice: string;
}

export interface ITransaction {
  hash: string;
  method?: string;
  blockNumber: string;
  time: string; // Info: (20260130 - Julian) Elapsed time
  timestamp: string; // Info: (20260130 - Julian) Full date/time
  from: string;
  fromLabel?: string;
  to: string;
  toLabel?: string;
  value: string;
  fee: string;
  type?: string;
  description?: string;
}

export interface IChain {
  id: string;
  name: string;
  icon: string; // Info: (20260130 - Julian) Changed from LucideIcon to string for serialization
  color: string;
  bgColor: string;
  description: string;
  stats: IChainStat[];
  details?: IDetailedStats;
}
