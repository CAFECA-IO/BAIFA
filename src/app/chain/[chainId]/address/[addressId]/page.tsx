'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Copy,
  QrCode,
  AlertTriangle,
  ChevronDown,
  Search,
  ArrowRight,
  Info,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useBlockchainData } from '@/lib/hooks/use_blockchain_data';
import { truncateAddress } from '@/lib/utils/format';
import { useState } from 'react';

export default function AddressDetailPage() {
  const params = useParams();
  const chainId = params?.chainId as string;
  const addressId = params?.addressId as string;

  const { transactions, latestGasPrice, loading } = useBlockchainData(chainId);
  const [activeTab, setActiveTab] = useState('交易');

  // Mocked stats
  const stats = {
    totalAssets: '$54.18K',
    assetsChange: '+1.49%',
    ethBalance: '18.4344861 ETH',
    ethValue: '$54.13K',
    usdtBalance: '0.01 USDT',
    usdcBalance: '30.12 USDC',
    outgoingTxns: '373.63K',
    outgoingEth: '2.66K ETH',
    incomingTxns: '825',
    incomingEth: '286.2875 ETH',
    primaryCounterparty: 'LIDO',
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Info */}
      <div className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
            E
          </div>
          <h1 className="text-base font-bold text-gray-900">Ethereum 瀏覽器</h1>
          <span className="flex items-center gap-1 rounded bg-orange-50 px-2 py-0.5 text-xs text-orange-500">
            ⛽ {latestGasPrice || '0.03 Gwei'}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-8">
        {/* Address Identity Section */}
        <div className="mb-6 flex flex-col items-start gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-200">
                {/* Mock Identicon */}
                <div className="grid h-full grid-cols-2 gap-0.5 p-1">
                  <div className="bg-orange-400"></div>
                  <div className="bg-blue-400"></div>
                  <div className="bg-green-400"></div>
                  <div className="bg-purple-400"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">地址</span>
                <span className="text-xl font-medium text-gray-500">{addressId}</span>
                <Copy size={18} className="cursor-pointer text-gray-400 hover:text-black" />
                <QrCode size={18} className="cursor-pointer text-gray-400 hover:text-black" />
              </div>
            </div>
            <button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-white hover:text-black">
              <ExternalLink size={18} />
            </button>
          </div>

          {/* Warning Banner */}
          <div className="flex w-full items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-4 text-sm text-gray-800">
            <AlertTriangle className="shrink-0 text-orange-500" size={18} />
            <p>
              該地址被舉報為 <span className="font-bold">Hack 地址</span>
              ，請注意可能涉及的風險！如果您認為這是一個錯誤，
              <Link href="#" className="font-bold text-[#5841D8] hover:underline">
                請通知我們
              </Link>
              。
            </p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">
              # Hack
            </span>
          </div>
        </div>

        {/* Asset Overview Board */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-400">Ethereum 鏈總資產</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">{stats.totalAssets}</span>
                <span className="text-sm font-bold text-green-500">{stats.assetsChange}</span>
              </div>
            </div>
            <div className="space-y-2 border-l border-gray-100 pl-8">
              <div className="text-xs font-medium text-gray-400">ETH 持倉</div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900">{stats.ethBalance}</span>
                <span className="text-xs text-gray-500">({stats.ethValue})</span>
              </div>
            </div>
            <div className="space-y-2 border-l border-gray-100 pl-8">
              <div className="text-xs font-medium text-gray-400">USDT 持倉</div>
              <div className="text-base font-bold text-gray-900">{stats.usdtBalance}</div>
            </div>
            <div className="flex items-center justify-between border-l border-gray-100 pl-8">
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-400">USDC 持倉</div>
                <div className="text-base font-bold text-gray-900">{stats.usdcBalance}</div>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-gray-900">
                展開 <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-200">
          {['交易', '代幣轉帳', '內部交易', '資產', '多鏈資產'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-4 text-sm font-bold transition-colors ${
                activeTab === tab ? 'text-[#5841D8]' : 'text-gray-500 hover:text-black'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#5841D8]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400">
              開始日期 <ArrowRight size={14} /> 結束日期
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              發送方/接收方 <ChevronDown size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              數量 <ChevronDown size={14} className="text-gray-400" />
            </div>
            <div className="relative">
              <Search
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="搜索方法"
                className="rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-[#5841D8]/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">交易狀態：</span>
              <span className="font-bold text-gray-900">全部</span>
              <ChevronRight size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">展示交易統計數據</span>
              <div className="relative h-5 w-10 rounded-full bg-black">
                <div className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-1 text-xs text-gray-400">
              轉出交易數 <Info size={12} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">{stats.outgoingTxns}</span>
              <span className="text-xs font-medium text-gray-400">({stats.outgoingEth})</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-1 text-xs text-gray-400">
              轉入交易數 <Info size={12} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">{stats.incomingTxns}</span>
              <span className="text-xs font-medium text-gray-400">({stats.incomingEth})</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-1 text-xs text-gray-400">
              主要交易對手 <Info size={12} />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5841D8]/10 text-[8px] font-bold text-[#5841D8]">
                L
              </div>
              <span className="text-base font-bold text-[#5841D8]">
                {stats.primaryCounterparty}
              </span>
              <Copy size={12} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 bg-white p-4 text-sm text-gray-500">
            <div>
              共計 <span className="font-bold text-gray-900">374,643</span> 條交易記錄 (僅展示近 1
              萬條數據)
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative h-4 w-8 rounded-full bg-gray-200">
                  <div className="absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white"></div>
                </div>
                <span>隱藏數量為 0 的交易</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-300">
                  <ChevronLeft size={20} />
                </button>
                <span className="font-bold text-gray-900">1 / 500</span>
                <button className="text-gray-400">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-4">交易哈希</th>
                  <th className="px-6 py-4">方法</th>
                  <th className="px-6 py-4">區塊</th>
                  <th className="px-6 py-4 text-[#5841D8]">時間</th>
                  <th className="px-6 py-4">發送方</th>
                  <th className="px-4 py-4"></th>
                  <th className="px-6 py-4">接收方</th>
                  <th className="px-6 py-4">數量</th>
                  <th className="px-6 py-4">手續費</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((txn, idx) => {
                  const isOut = idx % 2 === 0;
                  return (
                    <tr key={txn.hash} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-5">
                        <Link href={`/tx/${txn.hash}`} className="font-mono text-[#5841D8]">
                          {truncateAddress(txn.hash, 10, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">
                          {txn.method}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <Link href={`/block/${txn.blockNumber}`} className="text-[#5841D8]">
                          {txn.blockNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                        {txn.timestamp.split(' ')[1]}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/address/${txn.fromLabel}`}
                            className="font-mono text-[#5841D8]"
                          >
                            {txn.from}
                          </Link>
                          <Copy size={12} className="text-gray-300" />
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${isOut ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}
                        >
                          {isOut ? 'Out' : 'In'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/address/${txn.toLabel}`}
                            className="font-mono text-[#5841D8]"
                          >
                            {txn.to}
                          </Link>
                          <Copy size={12} className="text-gray-300" />
                        </div>
                      </td>
                      <td
                        className={`px-6 py-5 font-bold ${isOut ? 'text-gray-900' : 'text-gray-900'}`}
                      >
                        {isOut ? '-' : ''}
                        {txn.value}
                      </td>
                      <td className="px-6 py-5 text-gray-400">{txn.fee}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
