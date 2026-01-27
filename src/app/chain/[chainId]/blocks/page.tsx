'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Copy, AlertCircle, Loader2 } from 'lucide-react';
import { useBlockchainData } from '@/lib/hooks/use_blockchain_data';
import { useFetchApi } from '@/lib/hooks/use_fetch_api';
import { API_METHOD } from '@/constants/api_method';
import { IBlock, IChain } from '@/interfaces/chain';
import ChainHeader from '@/components/chain/chain_header';
import Pagination, { PaginationType } from '@/components/common/pagination';

const BlockItem = ({ block }: { block: IBlock }) => {
  const params = useParams();
  const isAlertBlock = false; // mock

  const addressPath = `/chain/${params.chainId}/address/${block.proposer}`;

  const copyAddressHandler = () => {
    navigator.clipboard.writeText(block.proposer);
  };

  const isShowAlertIcon = isAlertBlock && <AlertCircle size={14} className="text-orange-400" />;

  return (
    <tr key={block.height} className="hover:bg-gray-50/50">
      <td className="px-6 py-5">
        <Link href={`/block/${block.height}`} className="font-medium text-[#5841D8]">
          {block.height}
        </Link>
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-gray-600">{block.timestamp.split(' ')[1]}</td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-1.5">
          {isShowAlertIcon}
          <Link href={addressPath} className="font-mono text-[#5841D8] hover:underline">
            {block.proposer}
          </Link>
          <button
            type="button"
            className="cursor-pointer text-gray-300 hover:text-gray-500"
            onClick={copyAddressHandler}
          >
            <Copy size={12} />
          </button>
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
            <span className="text-[10px] text-gray-400">{block.gasUsedPercent.toFixed(2)}%</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-gray-900">{block.gasLimit}</td>
      <td className="px-6 py-5 text-gray-600">{block.gasPrice}</td>
      <td className="px-6 py-5 text-gray-900">{block.reward}</td>
    </tr>
  );
};

export default function BlockListPage() {
  const params = useParams();
  const chainId = params?.chainId as string;

  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fetch chain info for header
  const { data: chain } = useFetchApi<IChain>({
    url: chainId ? `/api/v1/chains/${chainId}` : null,
    method: API_METHOD.POST,
    errorMessage: '無法下載鏈詳情',
  });

  // 2. Fetch block data
  const { blocks, loading, error } = useBlockchainData(chainId);

  const blockCount = '0'; // Mocked or derived from latest block
  const totalPage = Math.ceil(Number(blockCount) / 10);

  if (loading && blocks.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-20 pt-6 text-black">
        {/* Header Info */}
        <ChainHeader
          chain={chain ?? undefined}
          //  showDetails={showDetails}
          //  onToggleDetails={() => setShowDetails(!showDetails)}
          // latestGasPrice={latestGasPrice}
        />

        <div className="mx-auto max-w-7xl px-6 pt-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">區塊列表</h2>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Table Header / Pagination Info */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 text-sm text-gray-500">
              <div>
                共計 <span className="font-medium text-gray-900">{blockCount}</span> 個區塊
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
                  {blocks.map((block) => (
                    <BlockItem key={block.height} block={block} />
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
