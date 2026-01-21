import { IChainStat } from '@/interfaces/chain';

export default function ChainStats({ stats }: { stats?: IChainStat[] }) {
    if (!stats) return null;

    return (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm overflow-x-auto">
            <div className="flex flex-col md:flex-row w-full">
                {stats.map((stat, index) => (
                    <div key={index} className="flex-1 flex flex-col border-b border-gray-100 md:border-b-0 md:border-r last:border-0 py-4 md:py-0 px-0 md:px-6 first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0">
                        <div className="mb-2 text-xs text-gray-400 font-medium tracking-wide">
                            {stat.label}
                        </div>
                        <div className="flex items-center gap-3 h-8">
                            <span className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">{stat.value}</span>
                            {stat.change && (
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-semibold ${stat.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                                        {stat.change}
                                    </span>
                                    {/* Mock Sparkline */}
                                    <svg width="60" height="20" viewBox="0 0 60 20" className="opacity-70 hidden xl:block">
                                        <path
                                            d={stat.isNegative
                                                ? "M0 5 Q15 5 30 15 T60 18"
                                                : "M0 15 Q15 15 30 5 T60 2"}
                                            fill="none"
                                            stroke={stat.isNegative ? "#ef4444" : "#22c55e"}
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
