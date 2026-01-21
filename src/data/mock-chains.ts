import { IChain } from '@/interfaces/chain';

export const MOCK_CHAINS: IChain[] = [
    {
        id: 'btc',
        name: 'Bitcoin',
        icon: 'Bitcoin',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        stats: [
            { label: 'Bitcoin 價格', value: '$96,874.12', change: '-3.76%', isNegative: true },
            { label: '市值', value: '1.78T' },
            { label: '總交易數', value: '1.2B txns' },
            { label: '最佳手續費', value: '14 sat/vB' },
            { label: '24h 鏈上交易量', value: '866.13K BTC' },
        ],
    },
    {
        id: 'eth',
        name: 'Ethereum',
        icon: 'Hexagon',
        color: 'text-white',
        bgColor: 'bg-white/10',
        stats: [
            { label: 'Ethereum 價格', value: '$2,966.54', change: '-4.6%', isNegative: true },
            { label: '市值', value: '$359.46B' },
            { label: '總交易數', value: '3.21B txns' },
            { label: 'Gas 均價', value: '0.5199 Gwei' },
            { label: 'ETH 質押量', value: '35.21M' },
            { label: '24h 鏈上交易量', value: '2.58M ETH' },
        ],
        details: {
            transactions: [
                { label: '總交易數', value: '3,208,121,418 txns' },
                { label: '待確認交易數', value: '168,990 txns' },
                { label: '總交易量', value: '589.42M ETH' },
                { label: '24h 鏈上交易量', value: '2.58M ETH' },
            ],
            addresses: [
                { label: '地址總數', value: '457,735,425', subValue: '+502,245' },
                { label: '合約地址數', value: '90,628,245', subValue: '+0' },
                { label: '普通地址數', value: '367,107,180', subValue: '+502,245' },
                { label: '持有 ETH 地址數', value: '174,383,453', subValue: '+139,245' },
                { label: '活躍地址數', value: '1,497,619', subValue: '+22,511' },
            ],
            tokens: [
                { label: '代幣總數', value: '3,447,726', subValue: '+850' },
                { label: 'ERC-20 代幣', value: '1,524,322', subValue: '+715' },
                { label: 'ERC-721 代幣', value: '1,481,304', subValue: '+44' },
                { label: 'ERC-1155 代幣', value: '442,100', subValue: '+91' },
            ],
            overview: [
                { label: '發行日期', value: '2014/07/24' },
                { label: 'TPS', value: '33.04 筆/秒' },
                { label: '平均出塊時間', value: '12 秒' },
                { label: '共識算法', value: 'PoW > PoS' },
                { label: '核心算法', value: 'Ethash' },
            ]
        }
    },
    {
        id: 'xlayer',
        name: 'X Layer',
        icon: 'Layers',
        color: 'text-white',
        bgColor: 'bg-white/10',
        stats: [
            { label: 'X Layer 價格', value: '$12.45', change: '+1.2%', isNegative: false },
            { label: '總交易筆數', value: '102.8M Txns' },
            { label: '24h 鏈上交易量', value: '67.5K OKB' },
            { label: '活躍地址數', value: '46,387' },
        ],
    },
    {
        id: 'sol',
        name: 'Solana',
        icon: 'Zap',
        color: 'text-purple-400',
        bgColor: 'bg-purple-900/20',
        stats: [
            { label: 'Solana 價格', value: '$180.2', change: '-5.80%', isNegative: true },
            { label: '市值', value: '71.69B' },
            { label: 'TPS', value: '3,057' },
            { label: '總交易筆數', value: '329B+' },
        ],
    },
    {
        id: 'tron',
        name: 'TRON',
        icon: 'Command',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        stats: [
            { label: 'TRX 價格', value: '$0.12', change: '-1.5%', isNegative: true },
            { label: '市值', value: '28.18B' },
            { label: 'TPS', value: '134' },
            { label: '24h 鏈上交易量', value: '885M TRX' },
        ],
    },
    {
        id: 'bnb',
        name: 'BNB Chain',
        icon: 'Box',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        stats: [
            { label: 'BNB 價格', value: '$560.1', change: '-2.1%', isNegative: true },
            { label: '市值', value: '119.66B' },
            { label: 'TPS', value: '237' },
            { label: '24h 鏈上交易量', value: '1.5M BNB' },
        ],
    },
    {
        id: 'base',
        name: 'Base',
        icon: 'Database',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        stats: [
            { label: 'TVL', value: '$2.9B' },
            { label: '24h 鏈上交易量', value: '176.36K ETH' },
            { label: '活躍地址數', value: '1.5M' },
        ],
    },
    {
        id: 'sui',
        name: 'Sui',
        icon: 'Droplet',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        stats: [
            { label: 'SUI 價格', value: '$1.56', change: '+5.4%', isNegative: false },
            { label: '24h 鏈上交易量', value: '130.9B SUI' },
            { label: '活躍地址數', value: '603K' },
            { label: 'Gas 價格', value: '501 MIST' },
        ],
    },
];
