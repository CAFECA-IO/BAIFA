import { ArrowRight } from 'lucide-react';

const blocks = [
    { height: '24281681', time: '12 秒前', producer: '0xdadb...0ce9a924f783711', txns: '504', reward: '0.0199803 ETH', gas: '0.57 Gwei' },
    { height: '24281680', time: '24 秒前', producer: '0x4838...f73ce8b0bad5f97', txns: '564', reward: '0.01567739 ETH', gas: '0.4 Gwei' },
    { height: '24281679', time: '36 秒前', producer: '0x388c...a736a67ccb19297', txns: '261', reward: '0.00320749 ETH', gas: '0.27 Gwei' },
    { height: '24281678', time: '48 秒前', producer: '0x4838...f73ce8b0bad5f97', txns: '286', reward: '0.01498712 ETH', gas: '0.62 Gwei' },
];

export default function BlockList() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-900">區塊</h2>
                <button className="text-gray-400 hover:text-black">
                    <ArrowRight size={20} />
                </button>
            </div>
            <div>
                {blocks.map((block) => (
                    <div key={block.height} className="flex items-center gap-4 border-b border-gray-100 p-4 last:border-0 hover:bg-gray-50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-500">
                            <span className="font-bold">Bk</span>
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-600">{block.height}</span>
                                <span className="text-xs text-gray-400">{block.time}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                出塊者 <span className="text-blue-600">{block.producer}</span>
                            </div>
                            <div className="text-xs text-gray-900">
                                <span className="font-bold">{block.txns} 筆交易</span> 獎勵 {block.reward}
                            </div>
                        </div>
                        <div className="flex h-6 items-center rounded bg-orange-50 px-2 text-[10px] font-bold text-orange-500 border border-orange-100">
                            ⛽ {block.gas}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
