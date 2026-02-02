'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';
import { IBlock } from '@/interfaces/chain';
import { IJsonRpcBlock } from '@/interfaces/rpc';
import Pagination, { PaginationType } from '@/components/common/pagination';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';
import { formatRpcBlock } from '@/lib/utils/format';
import CopyButton from '@/components/common/copy_button';

const BlockItem = ({ block }: { block: IBlock }) => {
  const pathname = usePathname();
  const params = useParams();
  const chainId = params?.chainId as string;

  // Info: (20260202 - Julian) 連結路徑
  const blockPath = `${pathname}/${block.height}`;
  const addressPath = `/chain/${chainId}/address/${block.proposer}`;
  const isAlertBlock = false; // Info: (20260130 - Julian) mock
  const isShowAlertIcon = isAlertBlock && <AlertCircle size={14} className="text-orange-400" />;

  return (
    <tr className="animate-block-in hover:bg-gray-50/50">
      <td className="px-3 py-5">
        <Link href={blockPath} className="font-bold text-[#5841D8] hover:underline">
          {block.height}
        </Link>
      </td>
      <td className="px-3 py-5 whitespace-nowrap text-gray-600">{block.timestamp.split(' ')[1]}</td>
      <td className="px-3 py-5">
        <div className="flex items-center gap-1.5">
          {isShowAlertIcon}
          <Link href={addressPath} className="font-mono text-[#5841D8] hover:underline">
            {block.proposer}
          </Link>
          <CopyButton value={block.proposer} />
        </div>
      </td>
      <td className="px-3 py-5 text-gray-900">{block.txns}</td>
      <td className="px-3 py-5 text-gray-500">{block.size}</td>
      <td className="px-3 py-5" aria-label="Gas Usage">
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
      <td className="px-3 py-5 text-gray-900">{block.gasLimit}</td>
      <td className="px-3 py-5 text-gray-600">{block.gasPrice}</td>
      <td className="px-3 py-5 text-gray-900">{block.reward}</td>
    </tr>
  );
};

const BlockTable = () => {
  const params = useParams();
  const chainId = params?.chainId as string;

  const [error, setError] = useState<string | null>();
  const [latestBlockHeight, setLatestBlockHeight] = useState<number>(0);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const { getLatestBlockNumber, getBlocksBatch, isLoading, error: rpcError } = useEthRpc(chainId);

  // Info: (20260130 - Julian) 計算總頁數（BigInt 轉換為 Number 進行計算）
  const totalPages = Math.ceil(latestBlockHeight / pageSize);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        // 1. 取得最新高度
        const latestHex = await getLatestBlockNumber();
        if (!latestHex) return;

        const latestBn = BigInt(latestHex);
        setLatestBlockHeight(Number(latestBn));

        // 2. 計算這一頁需要抓取的區塊高度陣列
        const startHeight = latestBn - BigInt((currentPage - 1) * pageSize);
        const heights = Array.from({ length: pageSize })
          .map((_, i) => startHeight - BigInt(i))
          .filter((h) => h >= 0n);

        // 3. 使用 Hook 的 Batch 方法
        const blockDatas = await getBlocksBatch(heights, true);

        // 4. 轉換格式
        if (blockDatas) {
          const blocksData = blockDatas
            .map((res) => res.result)
            .filter((block): block is IJsonRpcBlock => !!block);
          setBlocks(blocksData.map(formatRpcBlock));
        }
      } catch (err: unknown) {
        console.error('Fetch blocks error:', err);
        setError(err as string);
      }
    };

    fetchBlocks();
  }, [chainId, currentPage]);

  // Info: (20260202 - Julian) 發生錯誤
  if (rpcError || error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500">{rpcError || error}</p>
      </div>
    );
  }

  const isDisplayedBlocks = isLoading ? (
    // Info: (20260202 - Julian) 載入中
    <tr>
      <td colSpan={10} className="p-10 text-center font-semibold">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-600" />
      </td>
    </tr>
  ) : blocks.length === 0 ? (
    // Info: (20260202 - Julian) 無資料
    <tr>
      <td colSpan={10} className="p-10 text-center font-semibold">
        <p className="text-gray-900">尚無數據</p>
      </td>
    </tr>
  ) : (
    // Info: (20260202 - Julian) 渲染區塊列表
    blocks.map((block) => <BlockItem key={block.height} block={block} />)
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Info: (20260130 - Julian) Table Header / Pagination Info */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4 text-sm text-gray-500">
        <div>
          共計 <span className="font-medium text-gray-900">{latestBlockHeight}</span> 個區塊
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          type={PaginationType.NUMBER_WITH_SLASH}
          aria-label="Pagination Navigation"
        />
      </div>

      {/* Info: (20260130 - Julian) Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-3 py-4">區塊</th>
              <th className="px-3 py-4 text-[#5841D8]">時間</th>
              <th className="px-3 py-4">驗證者</th>
              <th className="px-3 py-4">總交易數</th>
              <th className="px-3 py-4">區塊大小</th>
              <th className="px-3 py-4">Gas 消耗</th>
              <th className="px-3 py-4">Gas 限額</th>
              <th className="px-3 py-4">Gas 均價</th>
              <th className="px-3 py-4">區塊獎勵</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">{isDisplayedBlocks}</tbody>
        </table>
      </div>

      {/* Info: (20260130 - Julian) Footer Pagination */}
      <div className="flex items-center justify-end border-t border-gray-100 p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          type={PaginationType.TEXT}
        />
      </div>
    </div>
  );
};

export default BlockTable;
