import Link from 'next/link';
import { Layers, Hexagon, Zap, Box } from 'lucide-react';
import { MOCK_CHAINS } from '@/data/mock-chains';
import { ICON_MAP } from '@/lib/maps';

export default function ChainList() {
    return (
        <section className="mx-[20px] w-full max-w-7xl px-4 py-8 pb-32">
            <p className='mb-4 text-3xl font-bold'>多鏈數據，一站解決</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_CHAINS.map((chain) => {
                    const Icon = ICON_MAP[chain.icon] || Hexagon;
                    return (
                        <Link
                            key={chain.name}
                            href={`/${chain.id}`}
                            className="flex flex-col justify-between rounded-xl border border-gray-800 bg-[#111] p-6 transition hover:cursor-pointer hover:bg-slate-800"
                        >
                            <div className="mb-6 flex items-center gap-4">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${chain.bgColor}`}
                                >
                                    <Icon className={`h-6 w-6 ${chain.color}`} />
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
                        </Link>
                    );
                })}

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
