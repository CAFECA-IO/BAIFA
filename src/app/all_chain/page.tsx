import { Search } from 'lucide-react';
import Link from 'next/link';
import { MOCK_CHAINS } from '@/data/mock_chains';
import { ICON_MAP } from '@/lib/maps';
import { Hexagon } from 'lucide-react';

export default function AllChainPage() {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        42條鏈數據，一站式覆蓋
                        <span className="text-gray-500 text-sm font-normal cursor-pointer hover:text-white">filter</span>
                    </h1>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索地址 / 交易 / 區塊 / 代幣 / ENS"
                            className="w-full rounded-full bg-[#1A1A1A] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-gray-600"
                            aria-label="Search chains"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {MOCK_CHAINS.map((chain) => {
                        const Icon = ICON_MAP[chain.icon] || Hexagon;
                        return (
                            <Link
                                key={chain.id}
                                href={`/chain/${chain.id}`}
                                className="rounded-xl flex-col border border-gray-800 bg-[#111] p-6 transition flex hover:cursor-pointer hover:bg-slate-800"
                            >
                                {/* Chain Header */}
                                <div className="mb-6 flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${chain.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${chain.color}`} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold">{chain.name}</span>
                                        <Link href="#" className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20">
                                            OKX Wallet ↗
                                        </Link>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-3 lg:grid-cols-6">
                                    {chain.stats.map((stat, index) => (
                                        <div key={index} className="flex flex-col">
                                            <span className="mb-1 text-xs text-gray-500">{stat.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${stat.label.includes('半減時間') ? 'text-blue-400' : 'text-white'}`}>
                                                    {stat.value}
                                                </span>
                                                {stat.change && (
                                                    <span className={`text-xs ${stat.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                                                        {stat.change}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
