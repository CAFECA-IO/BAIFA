import { Bitcoin, Layers, Hexagon, Zap, Command, Box, Database, Droplet, LucideIcon } from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
    'Bitcoin': Bitcoin,
    'Ethereum': Hexagon,
    'Hexagon': Hexagon,
    'X Layer': Layers,
    'Layers': Layers,
    'Solana': Zap,
    'Zap': Zap,
    'TRON': Command,
    'Command': Command,
    'BNB Chain': Box,
    'Box': Box,
    'Base': Database,
    'Database': Database,
    'Sui': Droplet,
    'Droplet': Droplet,
};
