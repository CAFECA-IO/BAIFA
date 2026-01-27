'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Copy, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useBlockchainData } from '@/lib/hooks/use_blockchain_data';
import { useFetchApi } from '@/lib/hooks/use_fetch_api';
import { API_METHOD } from '@/constants/api_method';
import { IChain } from '@/interfaces/chain';

export default function BlockListPage() {
  const params = useParams();
  const chainId = params?.chainId as string;

  // 1. Fetch chain info for header
  const { data: chain } = useFetchApi<IChain>({
    url: chainId ? `/api/v1/chains/${chainId}` : null,
    method: API_METHOD.POST,
    errorMessage: '無法下載鏈詳情',
  });

  // 2. Fetch block data
  const { blocks, loading, error } = useBlockchainData(chainId);

  const blockCount = '8,786,179'; // Mocked or derived from latest block

  if (loading && blocks.length === 0) {
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
          <img src="/ethereum-logo.png" alt="" className="h-5 w-5" />
          <h1 className="text-base font-bold text-gray-900">{chain?.name || 'Ethereum'} 瀏覽器</h1>
          <span className="flex items-center gap-1 rounded bg-orange-50 px-2 py-0.5 text-xs text-orange-500">
            ⛽ 0.04 Gwei
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">區塊列表</h2>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Table Header / Pagination Info */}
          <div className="flex items-center justify-between border-b border-gray-100 p-4 text-sm text-gray-500">
            <div>
              共計 <span className="font-medium text-gray-900">{blockCount}</span> 個區塊 (僅展示近
              1 萬條數據)
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="rounded p-1 text-gray-300 hover:bg-gray-50">
                  <ChevronLeft size={18} />
                </button>
                <span className="font-medium text-gray-900">1 / 500</span>
                <button className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-900">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-4">區塊</th>
                  <th className="px-6 py-4 text-[#5841D8]">時間</th>
                  <th className="px-6 py-4">驗證者</th>
                  <th className="px-6 py-4">總交易數</th>
                  <th className="px-6 py-4">區塊大小</th>
                  <th className="px-6 py-4">Gas 消耗</th>
                  <th className="px-6 py-4">Gas 限額</th>
                  <th className="px-6 py-4">Gas 均價</th>
                  <th className="px-6 py-4">區塊獎勵</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blocks.map((block, idx) => (
                  <tr key={block.height} className="hover:bg-gray-50/50">
                    <td className="px-6 py-5">
                      <Link href={`/block/${block.height}`} className="font-medium text-[#5841D8]">
                        {block.height}
                      </Link>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                      {block.timestamp.split(' ')[1]}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5">
                        {idx % 3 === 1 && <AlertCircle size={14} className="text-orange-400" />}
                        <Link href="/" className="font-mono text-[#5841D8]">
                          {block.proposer}
                        </Link>
                        <Copy
                          size={12}
                          className="cursor-pointer text-gray-300 hover:text-gray-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-900">{block.txns}</td>
                    <td className="px-6 py-5 text-gray-500">{block.size}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-900">{block.gasUsed}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full bg-gray-400"
                              style={{ width: `${Math.min(block.gasUsedPercent, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {block.gasUsedPercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-900">{block.gasLimit}</td>
                    <td className="px-6 py-5 text-gray-600">{block.gasPrice}</td>
                    <td className="px-6 py-5 text-gray-900">{block.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="flex items-center justify-end border-t border-gray-100 p-4">
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                上一頁
              </button>
              <div className="flex items-center gap-1 px-2 text-sm">
                第 <span className="font-bold text-gray-900">1</span> 頁，共 500 頁
              </div>
              <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                下一頁
              </button>
            </div>
          </div>
        </div>

        {error && <div className="mt-4 text-center text-sm text-red-500">{error}</div>}
      </div>
    </div>
  );
}
