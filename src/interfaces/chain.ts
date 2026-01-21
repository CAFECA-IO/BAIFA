import { LucideIcon } from 'lucide-react';

export interface IChainStat {
    label: string;
    value: string;
    change?: string;
    isNegative?: boolean;
}

export interface IChain {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    stats: IChainStat[];
}
