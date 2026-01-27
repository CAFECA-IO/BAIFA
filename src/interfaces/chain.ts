export interface IChainStat {
  label: string;
  value: string;
  change?: string;
  subValue?: string; // For incremental values like +502,245
  isNegative?: boolean;
}

export interface IDetailedStats {
  transactions: IChainStat[];
  addresses: IChainStat[];
  tokens: IChainStat[];
  overview: IChainStat[];
}

// ... existing interfaces
export interface IBlock {
  height: string;
  time: string; // Elapsed time (e.g. 12s ago)
  timestamp: string; // Full date/time
  proposer: string;
  proposerLabel?: string;
  txns: number;
  reward: string;
  gas: string; // Gas price or similar summary
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
  time: string; // Elapsed time
  timestamp: string; // Full date/time
  from: string;
  fromLabel?: string;
  to: string;
  toLabel?: string;
  value: string;
  fee: string;
  type?: string;
}

export interface IChain {
  id: string;
  name: string;
  icon: string; // Changed from LucideIcon to string for serialization
  color: string;
  bgColor: string;
  description: string;
  stats: IChainStat[];
  details?: IDetailedStats;
}
