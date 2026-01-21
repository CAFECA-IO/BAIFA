import { ArrowRight } from 'lucide-react';

const txns = [
    { hash: '0x5e1b1de8504...', time: '21 小時前', from: 'Coinbase. User', to: 'Coinbase. DepositAn...', value: '91,914 ETH' },
    { hash: '0xf4d2348645a...', time: '19 小時前', from: 'Binance. DepositAndWi...', to: 'Binance. Withdraw_13', value: '18,762 ETH' },
    { hash: '0x263761188d8...', time: '20 小時前', from: 'Bybit. Cold Wallet_15', to: 'Bybit. DepositAndWith...', value: '15,000 ETH' },
    { hash: '0x25125b6b4e7...', time: '9 小時前', from: '0xb62c...6af53ae3994', to: '0x4ebb...119bd304003', value: '15,000 ETH' },
];

export default function TransactionList() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-900">大額交易</h2>
                <button className="text-gray-400 hover:text-black">
                    <ArrowRight size={20} />
                </button>
            </div>
            <div>
                {txns.map((txn) => (
                    <div key={txn.hash} className="flex items-center gap-4 border-b border-gray-100 p-4 last:border-0 hover:bg-gray-50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-500">
                            <span className="font-bold">Tx</span>
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-600">{txn.hash}</span>
                                <span className="text-xs text-gray-400">{txn.time}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="flex gap-1">發送方 <span className="text-blue-600 truncate max-w-[150px]">{txn.from}</span></span>
                                <span className="flex gap-1">接收方 <span className="text-blue-600 truncate max-w-[150px]">{txn.to}</span></span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-black">{txn.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
