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
    time: string;
    proposer: string;
    proposerLabel?: string;
    txns: number;
    reward: string;
    gas: string;
}

export interface ITransaction {
    hash: string;
    time: string;
    from: string;
    fromLabel?: string;
    to: string;
    toLabel?: string;
    value: string;
    type?: string;
}

export interface IChain {
    id: string;
    name: string;
    icon: string; // Changed from LucideIcon to string for serialization
    color: string;
    bgColor: string;
    stats: IChainStat[];
    details?: IDetailedStats;
}
