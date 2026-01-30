'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { IJsonRpcResponse, IJsonRpcBlock, IJsonRpcTransaction } from '@/interfaces/rpc';
import { fetchApi } from '@/lib/services/api_service';
import { formatHexToEther, truncateAddress } from '@/lib/utils/format';
import { getMethodDescription } from '@/lib/utils/transaction';
import CopyButton from '@/components/common/copy_button';
import Pagination, { PaginationType } from '@/components/common/pagination';
import BlockDetailHeader, { BlockDetailTabType } from '@/components/block/block_detail_header';
import Toggle from '@/components/common/toggle';

interface IBlockTransactionsPageProps {
  params: Promise<{
    chainId: string;
    blockId: string;
  }>;
}

export default function BlockTransactionsPage(props: IBlockTransactionsPageProps) {
  const params = use(props.params);
  const { chainId, blockId } = params;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [block, setBlock] = useState<IJsonRpcBlock | null>(null);
  const [transactions, setTransactions] = useState<IJsonRpcTransaction[]>([]);

  // Info: (20260130 - Julian) Filtering & Pagination
  const [methodFilter, setMethodFilter] = useState<string>('');
  const [addressFilter, setAddressFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hideZeroValue, setHideZeroValue] = useState<boolean>(false);
  const pageSize = 25;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `/api/v1/chains/${chainId}`;
        const isHash = blockId.startsWith('0x') && blockId.length === 66;
        const method = isHash ? 'eth_getBlockByHash' : 'eth_getBlockByNumber';
        let blockParam = blockId;
        if (!isHash && !blockId.startsWith('0x')) {
          blockParam = `0x${BigInt(blockId).toString(16)}`;
        }

        const blockRes = await fetchApi<IJsonRpcResponse<IJsonRpcBlock>>(url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: method,
            params: [blockParam, true], // Info: (20260130 - Julian) true to get full transactions
            id: 1,
          }),
        });

        if (!blockRes.result) {
          setError('Block not found');
        } else {
          setBlock(blockRes.result);
          setTransactions((blockRes.result.transactions as IJsonRpcTransaction[]) || []);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch block transactions:', err);
        setError('Failed to fetch block transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chainId, blockId]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
      </div>
    );
  }

  if (error || !block) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500">{error || 'Block not found'}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-[#5841D8] hover:underline"
        >
          返回上一頁
        </button>
      </div>
    );
  }

  const blockNumber = BigInt(block.number);

  // Info: (20260130 - Julian) Filtering logic
  const filteredTransactions = transactions.filter((tx) => {
    if (hideZeroValue && BigInt(tx.value) === 0n) return false;

    if (methodFilter) {
      const method = getMethodDescription(tx.input).toLowerCase();
      if (!method.includes(methodFilter.toLowerCase())) return false;
    }

    if (addressFilter) {
      const addr = addressFilter.toLowerCase();
      const fromMatch = tx.from?.toLowerCase().includes(addr);
      const tomatch = tx.to?.toLowerCase().includes(addr);
      if (!fromMatch && !tomatch) return false;
    }

    return true;
  });

  const totalCount = filteredTransactions.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <BlockDetailHeader
          chainId={chainId}
          blockId={blockId}
          blockNumber={blockNumber}
          activeTab={BlockDetailTabType.TRANSACTIONS}
        />

        {/* Info: (20260130 - Julian) Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
            <span className="text-sm whitespace-nowrap text-gray-500">發送方/接收方</span>
            <div className="mx-1 h-4 w-px bg-gray-200"></div>
            <input
              type="text"
              placeholder="輸入地址搜索"
              className="w-48 text-sm focus:outline-none"
              value={addressFilter}
              aria-label="Filter by Address"
              onChange={(e) => {
                setAddressFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="方法"
              className="w-32 text-sm focus:outline-none"
              value={methodFilter}
              aria-label="Filter by Method"
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Info: (20260130 - Julian)... Other filter placeholders ... */}
          <div className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 opacity-50 shadow-sm">
            <span className="text-sm text-gray-500">數量</span>
          </div>

          <div className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 opacity-50 shadow-sm">
            <span className="text-sm text-gray-500">交易類型: 全部</span>
          </div>

          <div className="ml-auto">
            <Toggle
              isOpen={hideZeroValue}
              onToggle={() => {
                setHideZeroValue((prev) => !prev);
                setCurrentPage(1);
              }}
              label={{
                open: '展示數量為 0 的交易',
                close: '展示數量為 0 的交易',
              }}
            />
          </div>
        </div>

        {/* Info: (20260130 - Julian) Transaction Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/50 p-4 text-sm font-medium text-gray-600">
            共計 {totalCount} 條數據
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-4">交易哈希</th>
                  <th className="px-6 py-4">方法</th>
                  <th className="px-6 py-4">發送方</th>
                  <th className="w-8 px-6 py-4 text-center" aria-label="Transaction Direction"></th>
                  <th className="px-6 py-4">接收方</th>
                  <th className="px-6 py-4">數量</th>
                  <th className="px-6 py-4 text-right">手續費</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => {
                    const method = getMethodDescription(tx.input);
                    const fee = formatHexToEther(
                      (BigInt(tx.gas || '0x0') * BigInt(tx.gasPrice || '0x0')).toString(16)
                    );

                    return (
                      <tr key={tx.hash} className="transition-colors hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <Link
                            href={`/chain/${chainId}/transactions/${tx.hash}`}
                            className="font-mono text-[#5841D8] hover:underline"
                          >
                            {truncateAddress(tx.hash, 10, 8)}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                            {method}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/chain/${chainId}/address/${tx.from}`}
                              className="font-mono text-[#5841D8] hover:underline"
                            >
                              {truncateAddress(tx.from)}
                            </Link>
                            <CopyButton value={tx.from} />
                          </div>
                        </td>
                        <td className="px-1 py-4 text-center" aria-label="Transaction Arrow">
                          <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-500">
                            <ArrowRight size={12} />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {tx.to ? (
                              <>
                                <Link
                                  href={`/chain/${chainId}/address/${tx.to}`}
                                  className="font-mono text-[#5841D8] hover:underline"
                                >
                                  {truncateAddress(tx.to)}
                                </Link>
                                <CopyButton value={tx.to} />
                              </>
                            ) : (
                              <span className="text-gray-400">合約創建</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {parseFloat(formatHexToEther(tx.value)).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 18,
                          })}{' '}
                          ETH
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-xs text-gray-500">
                          {parseFloat(fee).toFixed(8)} ETH
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      尚無匹配的交易數據
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Info: (20260130 - Julian) Footer with Pagination */}
          <div className="flex items-center justify-between border-t border-gray-100 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              每頁顯示 {pageSize} 條内容
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                type={PaginationType.TEXT}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
