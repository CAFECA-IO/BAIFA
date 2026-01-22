import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MOCK_BLOCKS } from '@/data/mock_blockchain_data';

export default function BlockList() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">區塊</h3>
                <ArrowRight size={20} className="text-gray-400 cursor-pointer hover:text-black" />
            </div>

            <div className="h-[430px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                {MOCK_BLOCKS.map((block) => (
                    <div key={block.height} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        {/* Icon */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                            Bk
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                                <Link href="/" className="font-bold text-[#5841D8] hover:underline">{block.height}</Link>
                                <span className="text-gray-400 text-xs">出塊者</span>
                                <Link href="/" className="truncate text-[#5841D8] hover:underline max-w-[120px]">{block.proposer}</Link>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{block.time}</span>
                                <span>{block.txns} 筆交易</span>
                                <span className="truncate">獎勵 {block.reward}</span>
                            </div>
                        </div>

                        {/* Gas */}
                        <div className="flex shrink-0 items-center gap-1 rounded bg-orange-50 px-2 py-1 text-xs font-medium text-orange-500 border border-orange-100">
                            ⛽ {block.gas}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button className="w-full rounded-full bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800">
                    查看全部區塊
                </button>
            </div>
        </div>
    );
}
