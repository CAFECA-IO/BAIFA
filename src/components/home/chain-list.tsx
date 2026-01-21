import { Bitcoin, Layers, Hexagon, Settings2 } from 'lucide-react';

const chains = [
    {
        name: 'Bitcoin',
        icon: Bitcoin,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
    },
    {
        name: 'Ethereum',
        icon: Hexagon, // Best approximation for diamond shape without SVG
        color: 'text-white',
        bgColor: 'bg-white/10',
    },
    {
        name: 'X Layer',
        icon: Layers,
        color: 'text-white',
        bgColor: 'bg-white/10',
    },
];

export default function ChainList() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                    多鏈數據，一站解決
                </h2>
                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                    <Settings2 size={16} />
                    自定義
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {chains.map((chain) => (
                    <div
                        key={chain.name}
                        className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-800 bg-[#111] p-6 transition hover:border-gray-700 hover:bg-[#161616]"
                    >
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${chain.bgColor}`}
                        >
                            <chain.icon className={`h-6 w-6 ${chain.color}`} />
                        </div>
                        <span className="text-lg font-bold text-white">{chain.name}</span>
                    </div>
                ))}

                {/* Chat Button (Floating) - mimicked from screenshot */}
                <button className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#5841D8] text-white shadow-lg transition hover:bg-[#4b36c0]">
                    <span className="text-2xl">💬</span>
                </button>
            </div>
        </section>
    );
}
