'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Copy, ArrowLeft, ArrowRight, ChevronRight, Loader2, Search } from 'lucide-react';
import { useBlockchainData } from '@/lib/hooks/use_blockchain_data';
import { useFetchApi } from '@/lib/hooks/use_fetch_api';
import { API_METHOD } from '@/constants/api_method';
import { IChain } from '@/interfaces/chain';
import { truncateAddress } from '@/lib/utils/format';
import Pagination, { PaginationType } from '@/components/common/pagination';
import ChainHeader from '@/components/chain/chain_header';

export default function TransactionListPage() {
  const params = useParams();
  const chainId = params?.chainId as string;

  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fetch chain info for header
  const { data: chain } = useFetchApi<IChain>({
    url: chainId ? `/api/v1/chains/${chainId}` : null,
    method: API_METHOD.POST,
    errorMessage: '無法下載鏈詳情',
  });

  // 2. Fetch block/transaction data
  const { transactions, loading, error } = useBlockchainData(chainId);

  const txnTotalCount = '0'; // Mocked
  const totalPage = Math.ceil(Number(txnTotalCount) / 10);

  if (loading && transactions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-7xl py-20 pt-6 text-black">
        {/* Header Info */}
        <div className="flex items-start gap-4">
          <Link
            href={`/chain/${chainId}`}
            className="cursor-pointer text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={32} />
          </Link>
          <ChainHeader
            chain={chain ?? undefined}
            //  showDetails={showDetails}
            //  onToggleDetails={() => setShowDetails(!showDetails)}
            // latestGasPrice={latestGasPrice}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">交易列表</h2>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="relative">
              <select className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-[#5841D8]/20 focus:outline-none">
                <option>數量</option>
              </select>
              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                <ChevronRight size={14} className="rotate-90 text-gray-400" />
              </div>
            </div>
            <div className="relative max-w-xs flex-1">
              <Search
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="方法"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-[#5841D8]/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Table Header / Pagination Info */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 text-sm text-gray-500">
              <div>
                近 24 小時內共計 <span className="font-medium text-gray-900">{txnTotalCount}</span>{' '}
                條交易記錄
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={(page) => setCurrentPage(page)}
                type={PaginationType.NUMBER_WITH_SLASH}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">交易哈希</th>
                    <th className="px-6 py-4">方法</th>
                    <th className="px-6 py-4">區塊</th>
                    <th className="px-6 py-4 text-[#5841D8]">時間</th>
                    <th className="px-6 py-4">發送方</th>
                    <th className="px-4 py-4 text-center"></th>
                    <th className="px-6 py-4">接收方</th>
                    <th className="px-6 py-4">數量</th>
                    <th className="px-6 py-4">手續費</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((txn) => (
                    <tr key={txn.hash} className="hover:bg-gray-50/50">
                      <td className="px-6 py-5">
                        <Link
                          href={`/tx/${txn.hash}`}
                          className="font-mono text-[#5841D8]"
                          title={txn.hash}
                        >
                          {truncateAddress(txn.hash, 8, 6)}
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                          {txn.method}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <Link href={`/block/${txn.blockNumber}`} className="text-[#5841D8]">
                          {txn.blockNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-gray-600">{txn.timestamp}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/address/${txn.fromLabel}`}
                            className="font-mono text-[#5841D8]"
                          >
                            {txn.from}
                          </Link>
                          <Copy
                            size={12}
                            className="cursor-pointer text-gray-300 hover:text-gray-500"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-500">
                          <ArrowRight size={14} />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/address/${txn.toLabel}`}
                            className="font-mono text-[#5841D8]"
                          >
                            {txn.to}
                          </Link>
                          <Copy
                            size={12}
                            className="cursor-pointer text-gray-300 hover:text-gray-500"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-gray-900">{txn.value}</td>
                      <td className="px-6 py-5 text-gray-500">{txn.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Pagination */}
            <div className="flex items-center justify-end border-t border-gray-100 p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={(page) => setCurrentPage(page)}
                type={PaginationType.TEXT}
              />
            </div>
          </div>

          {error && <div className="mt-4 text-center text-sm text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
}
