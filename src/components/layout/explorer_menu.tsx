import {
  Search,
  Bitcoin,
  Hexagon,
  Layers,
  Box,
  Zap,
  Command,
  Database,
  Droplet,
  Activity,
} from 'lucide-react';
import React from 'react';

const networks = [
  { name: 'Bitcoin', icon: Bitcoin, color: 'text-orange-500' },
  { name: 'Ethereum', icon: Hexagon, color: 'text-gray-800' },
  { name: 'X Layer', icon: Layers, color: 'text-black' },
  { name: 'Solana', icon: Zap, color: 'text-purple-500', fill: 'currentColor' }, // Solana-ish
  { name: 'TRON', icon: Command, color: 'text-red-500' },
  { name: 'BNB Chain', icon: Box, color: 'text-yellow-500' },
  { name: 'Base', icon: Database, color: 'text-blue-600' },
  { name: 'Sui', icon: Droplet, color: 'text-blue-400' },
  { name: 'Aptos', icon: Activity, color: 'text-teal-500' },
];

export default function ExplorerMenu() {
  return (
    <div className="absolute top-full left-0 mt-2 flex w-[600px] overflow-hidden rounded-xl bg-white text-black shadow-2xl ring-1 ring-black/5">
      {/* Left Column: Description */}
      <div className="w-1/3 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold">瀏覽器</h3>
        <p className="text-sm leading-relaxed text-gray-500">
          暢享全新 Web3 數據平臺，輕鬆獲取豐富的數據和強大的功能。 BAIFA
          瀏覽器現支持多種區塊鏈網絡和 Web3
          工具，讓您輕鬆進行鏈上數據分析，快速獲取重要的鏈上信息，滿足個性化需求。
        </p>
      </div>

      {/* Right Column: Network List */}
      <div className="w-2/3 bg-gray-50 p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            aria-label="Search networks"
            placeholder="搜索網絡"
            className="w-full rounded-md bg-gray-200 py-2 pr-4 pl-9 text-sm transition outline-none focus:bg-white focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div className="mb-2 flex items-center gap-2 px-2 text-sm font-bold text-gray-900">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-800 text-white">
            <span className="text-[10px]">::</span>
          </div>
          全部 42 網絡
        </div>

        <div className="h-[300px] overflow-y-auto pr-2">
          <div className="space-y-1">
            {networks.map((net) => (
              <button
                key={net.name}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 transition hover:bg-gray-200"
              >
                <div className={`flex h-6 w-6 items-center justify-center ${net.color}`}>
                  <net.icon size={20} fill={net.fill ? 'currentColor' : 'none'} />
                </div>
                <span className="font-bold text-gray-800">{net.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
