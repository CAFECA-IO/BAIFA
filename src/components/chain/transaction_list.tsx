import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MOCK_TRANSACTIONS } from '@/data/mock_blockchain_data';

export default function TransactionList() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">大額交易</h3>
                <ArrowRight size={20} className="text-gray-400 cursor-pointer hover:text-black" />
            </div>

            <div className="h-[430px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                {MOCK_TRANSACTIONS.map((txn) => (
                    <div key={txn.hash} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        {/* Icon */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                            Tx
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                                <Link href="/" className="font-bold text-[#5841D8] hover:underline truncate max-w-[80px]">{txn.hash}</Link>
                                <span className="text-gray-400 text-xs text-nowrap">發送方</span>
                                <Link href="/" className="truncate text-[#5841D8] hover:underline max-w-[100px] sm:max-w-[140px]">{txn.from}</Link>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-xs text-gray-500 min-w-[60px]">{txn.time}</span>
                                <span className="text-gray-400 text-xs text-nowrap">接收方</span>
                                <Link href="/" className="truncate text-[#5841D8] hover:underline max-w-[100px] sm:max-w-[140px]">{txn.to}</Link>
                            </div>
                        </div>

                        {/* Value */}
                        <div className="shrink-0 text-right">
                            <div className="text-sm font-bold text-gray-900">{txn.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button className="w-full rounded-full bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800">
                    查看全部大額交易
                </button>
            </div>
        </div>
    );
}
