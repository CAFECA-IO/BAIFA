import { LucideIcon } from 'lucide-react';

export interface ChainStat {
    label: string;
    value: string;
    change?: string;
    isNegative?: boolean;
}

export interface Chain {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    stats: ChainStat[];
}
