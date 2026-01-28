'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { IBlock } from '@/interfaces/chain';
import Pagination, { PaginationType } from '@/components/common/pagination';
import { API_METHOD } from '@/constants/api_method';
import { IJsonRpcResponse, IJsonRpcBlock } from '@/interfaces/rpc';
import { fetchApi } from '@/lib/services/api_service';
import CopyButton from '@/components/common/copy_button';

const BlockItem = ({ block }: { block: IBlock }) => {
  const params = useParams();
  const isAlertBlock = false; // mock

  const blockPath = `/`;
  const addressPath = `/chain/${params.chainId}/address/${block.proposer}`;

  const isShowAlertIcon = isAlertBlock && <AlertCircle size={14} className="text-orange-400" />;

  return (
    <tr className="animate-block-in hover:bg-gray-50/50">
      <td className="px-6 py-5">
        <Link href={blockPath} className="font-bold text-[#5841D8] hover:underline">
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
          <CopyButton value={block.proposer} />
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

const BlockTable = () => {
  const params = useParams();
  const chainId = params?.chainId as string;

  const [latestBlockHeight, setLatestBlockHeight] = useState<number>(0);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // 計算總頁數（BigInt 轉換為 Number 進行計算）
  const totalPages = Math.ceil(latestBlockHeight / pageSize);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const url = `/api/v1/chains/${chainId}`;

        // 1. 取得最新高度
        const bnRes = await fetchApi<IJsonRpcResponse<string>>(url, {
          method: API_METHOD.POST,
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
        });

        const latestBn = BigInt(bnRes?.result ?? '0');
        setLatestBlockHeight(Number(latestBn));

        // 2. 計算這一頁的起始高度
        const startHeight = latestBn - BigInt((currentPage - 1) * pageSize);

        // 3. Batch 請求該頁的所有區塊
        const requests = Array.from({ length: pageSize })
          .map((_, i) => {
            const targetHeight = startHeight - BigInt(i);
            return {
              jsonrpc: '2.0',
              method: 'eth_getBlockByNumber',
              params: [`0x${targetHeight.toString(16)}`, false],
              id: i,
            };
          })
          .filter((req) => BigInt(req.params[0]) >= 0n);

        if (requests.length === 0) {
          setBlocks([]);
          return;
        }

        const blocksRes = await fetchApi<IJsonRpcResponse<IJsonRpcBlock>[]>(url, {
          method: API_METHOD.POST,
          body: JSON.stringify(requests),
        });

        // 4. Update state
        const newBlocks = blocksRes
          .map((res) => res.result)
          .filter(Boolean)
          .map((block) => {
            const gasUsed = BigInt(block.gasUsed);
            const gasLimit = BigInt(block.gasLimit);
            const percent = Number((gasUsed * 10000n) / gasLimit) / 100;
            const diff = Math.floor((Date.now() - Number(block.timestamp) * 1000) / 1000);
            const timeAgo =
              diff < 60 ? `${diff}s ago` : `${Math.floor(diff / 60)}m ${diff % 60}s ago`;

            return {
              height: BigInt(block.number).toString(),
              time: timeAgo,
              timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
              proposer: block.miner,
              txns: Array.isArray(block.transactions) ? block.transactions.length : 0,
              reward: '0', // Not available in standard RPC
              gas: '0',
              size: BigInt(block.size).toString(),
              gasUsed: gasUsed.toString(),
              gasUsedPercent: percent,
              gasLimit: gasLimit.toString(),
              gasPrice: '0',
            } as IBlock;
          });

        setBlocks(newBlocks);
      } catch (error) {
        console.error('Fetch blocks error:', error);
      }
    };

    fetchBlocks();
  }, [chainId, currentPage]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Table Header / Pagination Info */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4 text-sm text-gray-500">
        <div>
          共計 <span className="font-medium text-gray-900">{latestBlockHeight}</span> 個區塊
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
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
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          type={PaginationType.TEXT}
        />
      </div>
    </div>
  );
};

export default BlockTable;
