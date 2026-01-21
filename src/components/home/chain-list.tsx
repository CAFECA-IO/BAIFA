import { Bitcoin, Layers, Hexagon, Zap, Command, Box, Database, Droplet } from 'lucide-react';

const chains = [
    {
        name: 'Bitcoin',
        icon: Bitcoin,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        stats: [
            { label: '市值', value: '1.78T', change: '-3.76%', isNegative: true },
            { label: '24h 鏈上交易量', value: '866.13K BTC' },
            { label: '最佳手續費', value: '0.0000109 BTC/KB' },
        ],
    },
    {
        name: 'Ethereum',
        icon: Hexagon,
        color: 'text-white',
        bgColor: 'bg-white/10',
        stats: [
            { label: '市值', value: '358.12B', change: '-7.33%', isNegative: true },
            { label: '24h 鏈上交易量', value: '2.18M ETH' },
            { label: 'Gas 均價', value: '0.5635 Gwei' },
        ],
    },
    {
        name: 'X Layer',
        icon: Layers,
        color: 'text-white',
        bgColor: 'bg-white/10',
        stats: [
            { label: '總交易筆數', value: '102,823,342 Txns' },
            { label: '24h 鏈上交易量', value: '67.5K OKB' },
            { label: '活躍地址數', value: '46,387' },
        ],
    },
    {
        name: 'Solana',
        icon: Zap,
        color: 'text-purple-400',
        bgColor: 'bg-purple-900/20',
        stats: [
            { label: '市值', value: '71.69B', change: '-5.80%', isNegative: true },
            { label: 'TPS', value: '3,057.00 Txns/sec' },
            { label: '總交易筆數', value: '329,108,304,860 Txns' },
        ],
    },
    {
        name: 'TRON',
        icon: Command,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        stats: [
            { label: '市值', value: '28.18B', change: '-4.53%', isNegative: true },
            { label: 'TPS', value: '134.51 Txns/sec' },
            { label: '24h 鏈上交易量', value: '885.16M TRX' },
        ],
    },
    {
        name: 'BNB Chain',
        icon: Box,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        stats: [
            { label: '市值', value: '119.66B', change: '-5.60%', isNegative: true },
            { label: 'TPS', value: '237.20 Txns/sec' },
            { label: '24h 鏈上交易量', value: '1.5M BNB' },
        ],
    },
    {
        name: 'Base',
        icon: Database,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        stats: [
            { label: '24h 鏈上交易量', value: '176.36K ETH' },
            { label: 'TVB', value: '2,961,143.37 ETH' },
            { label: '活躍地址數', value: '1,501,577' },
        ],
    },
    {
        name: 'Sui',
        icon: Droplet,
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        stats: [
            { label: '24h 鏈上交易量', value: '130.92B SUI' },
            { label: '活躍地址數', value: '603,958' },
            { label: 'Gas 價格', value: '501 MIST' },
        ],
    },
];

export default function ChainList() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 pb-32">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {chains.map((chain) => (
                    <div
                        key={chain.name}
                        className="flex flex-col justify-between rounded-xl border border-gray-800 bg-[#111] p-6 transition hover:border-gray-700 hover:bg-[#161616]"
                    >
                        <div className="mb-6 flex items-center gap-4">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full ${chain.bgColor}`}
                            >
                                <chain.icon className={`h-6 w-6 ${chain.color}`} />
                            </div>
                            <span className="text-xl font-bold text-white">{chain.name}</span>
                        </div>

                        <div className="space-y-4">
                            {chain.stats.map((stat, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{stat.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-200">{stat.value}</span>
                                        {stat.change && (
                                            <span className={stat.isNegative ? 'text-red-500' : 'text-green-500'}>
                                                {stat.change}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Dashboard Card */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-[#111] p-6 text-center">
                    <div className="mb-6 flex gap-2 opacity-50">
                        <Layers size={20} className="text-gray-400" />
                        <Hexagon size={20} className="text-gray-400" />
                        <Zap size={20} className="text-gray-400" />
                        <Box size={20} className="text-gray-400" />
                    </div>
                    <h3 className="mb-6 text-lg font-bold text-white">區塊鏈數據看板</h3>
                    <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5841D8] py-3 text-sm font-bold text-white transition hover:bg-[#4b36c0]">
                        查看更多
                    </button>
                </div>
            </div>
        </section>
    );
}
