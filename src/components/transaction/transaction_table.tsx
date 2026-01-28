'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, ChevronRight, Search } from 'lucide-react';
import { ITransaction } from '@/interfaces/chain';
import { truncateAddress } from '@/lib/utils/format';
import Pagination, { PaginationType } from '@/components/common/pagination';
import CopyButton from '@/components/common/copy_button';
import { IJsonRpcResponse, IJsonRpcBlock, IJsonRpcTransaction } from '@/interfaces/rpc';
import { fetchApi } from '@/lib/services/api_service';

const TransactionItem = ({ txn }: { txn: ITransaction }) => {
  const params = useParams();
  const chainId = params?.chainId as string;

  const transactionPath = `/chain/${chainId}/tx/${txn.hash}`;
  const blockPath = `/chain/${chainId}/block/${txn.blockNumber}`;
  const fromPath = `/chain/${chainId}/address/${txn.fromLabel}`;
  const toPath = `/chain/${chainId}/address/${txn.toLabel}`;

  const timestamp = new Date(parseInt(txn.timestamp) * 1000).toLocaleString();
  const validTimestamp = !!timestamp ? timestamp : txn.time;
  const datePart = validTimestamp.split(' ')[0];
  const timePart = validTimestamp.split(' ')[1];

  const displayFrom = !!txn.from ? (
    <div className="flex items-center gap-1.5">
      <Link href={fromPath} className="font-mono text-[#5841D8] hover:underline">
        {truncateAddress(txn.from)}
      </Link>
      <CopyButton value={txn.from} />
    </div>
  ) : (
    <p className="font-mono text-gray-600">Unknown</p>
  );
  const displayTo = !!txn.to ? (
    <div className="flex items-center gap-1.5">
      <Link href={toPath} className="font-mono text-[#5841D8] hover:underline">
        {truncateAddress(txn.to)}
      </Link>
      <CopyButton value={txn.to} />
    </div>
  ) : (
    <p className="font-mono text-gray-600">Unknown</p>
  );

  const displayTime = (
    <div className="flex flex-col items-center text-xs">
      <p>{datePart}</p>
      <p>{timePart}</p>
    </div>
  );

  const displayedMethod = (
    <div className="flex items-center gap-1.5">
      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-center text-[11px] font-medium text-gray-600">
        {txn.method}
      </span>
    </div>
  );

  const displayedDescription = <div>{txn.description}</div>;

  return (
    <tr className="animate-block-in hover:bg-gray-50/50">
      <td className="px-4 py-5">
        <Link href={transactionPath} className="font-mono text-[#5841D8]" title={txn.hash}>
          {truncateAddress(txn.hash, 8, 6)}
        </Link>
      </td>
      <td className="px-4 py-5">{displayedMethod}</td>
      <td className="px-4 py-5">{displayedDescription}</td>
      <td className="px-4 py-5">
        <Link href={blockPath} className="font-bold text-[#5841D8] hover:underline">
          {txn.blockNumber}
        </Link>
      </td>
      <td className="px-4 py-5 whitespace-nowrap text-gray-600">{displayTime}</td>
      <td className="px-4 py-5">{displayFrom}</td>
      <td className="text-center">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-500">
          <ArrowRight size={14} />
        </div>
      </td>
      <td className="px-4 py-5">{displayTo}</td>
      <td className="px-4 py-5 font-bold text-gray-900">{txn.value}</td>
      <td className="px-4 py-5 text-gray-500">{txn.fee}</td>
    </tr>
  );
};

const TransactionTable = () => {
  const params = useParams();
  const chainId = params?.chainId as string;

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [txnTotalCount, setTxnTotalCount] = useState<number>(0);
  const pageSize = 10;

  // ToDo: 須增加一個「描述這筆交易在做什麼」的欄位

  useEffect(() => {
    const fetchTransactionList = async () => {
      try {
        const url = `/api/v1/chains/${chainId}`;
        const MAX_BLOCKS_TO_SCAN = 50; // 最多往前掃描 50 個區塊來湊交易

        // 1. 取得最新區塊高度
        const bnRes = await fetchApi<IJsonRpcResponse<string>>(url, {
          method: 'POST',
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
        });
        const latestBn = BigInt(bnRes?.result ?? '0x0');

        // 2. 估算交易總分頁 (解決您提到的 TotalPages 問題)
        // 這裡我們暫且以「最新區塊高度」作為「交易序列」的錨點
        // 在沒有 Indexer 的情況下，這是讓分頁按鈕能點擊的唯一方式
        const totalItems = Number(latestBn);
        setTxnTotalCount(totalItems);
        setTotalPages(Math.ceil(totalItems / pageSize));

        // 3. 根據頁碼找出「起始搜尋區塊」
        // 假設每頁 10 筆，我們從基準區塊往回推
        let currentBnDec = latestBn - BigInt(currentPage - 1);
        // ToDo: 移除 any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let fetchedTxns: any[] = [];
        let blocksProcessed = 0;

        // 描述解析函式
        const getTxDescription = (tx: IJsonRpcTransaction) => {
          const input = tx.input || '0x';
          const methodId = input.slice(0, 10).toLowerCase();
          const SIGNATURES: { [key: string]: string } = {
            '0xa9059cbb': 'Transfer (ERC-20)',
            '0x095ea7b3': 'Approve (ERC-20)',
            '0x2ea01f9c': 'HandleOps (ERC-4337)',
            '0x6931966a': 'ForcedTransfer (ERC-3643)',
            '0x42842e0e': 'SafeTransfer (ERC-721)',
            '0xf242432a': 'SafeTransfer (ERC-1155)',
          };

          if (!tx.to) return 'Contract Creation';
          if (input === '0x' || input === '0x0')
            return `ETH Transfer (${parseFloat(tx.value).toFixed(4)} ETH)`;
          return SIGNATURES[methodId] || `Call: ${methodId}`;
        };

        // 4. 掃描區塊湊交易
        while (
          fetchedTxns.length < pageSize &&
          blocksProcessed < MAX_BLOCKS_TO_SCAN &&
          currentBnDec >= 0n
        ) {
          const res = await fetchApi<IJsonRpcResponse<IJsonRpcBlock>>(url, {
            method: 'POST',
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBlockByNumber',
              params: [`0x${currentBnDec.toString(16)}`, true],
              id: 2,
            }),
          });

          const block = res.result;
          if (block?.transactions?.length > 0) {
            // ToDo: 移除 any
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapped = block.transactions.map((tx: any) => ({
              hash: tx.hash,
              blockNumber: parseInt(block.number, 16),
              // 增加描述欄位
              description: getTxDescription(tx),
              time: new Date(parseInt(block.timestamp, 16) * 1000).toLocaleString(),
              from: tx.from,
              to: tx.to || 'New Contract',
              value: `${parseFloat(tx.value).toFixed(4)} ETH`,
            }));
            fetchedTxns = [...fetchedTxns, ...mapped.reverse()];
          }
          currentBnDec -= 1n;
          blocksProcessed++;
        }

        // 4. 更新狀態，只取該頁需要的筆數
        setTransactions(fetchedTxns.slice(0, pageSize));
      } catch (error) {
        console.error('Fetch transaction list error:', error);
      }
    };

    fetchTransactionList();
  }, [chainId, currentPage]);

  const diaplayedFilters = (
    <>
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
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="方法"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-[#5841D8]/20 focus:outline-none"
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      {diaplayedFilters}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header / Pagination Info */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4 text-sm text-gray-500">
          <div>
            近 24 小時內共計 <span className="font-medium text-gray-900">{txnTotalCount}</span>{' '}
            條交易記錄
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
                <th className="px-6 py-4">交易哈希</th>
                <th className="px-6 py-4">方法</th>
                <th className="px-6 py-4">交易描述</th>
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
                <TransactionItem key={txn.hash} txn={txn} />
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
    </>
  );
};

export default TransactionTable;
