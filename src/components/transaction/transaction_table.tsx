'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ITransaction } from '@/interfaces/chain';
import { truncateAddress } from '@/lib/utils/format';
import CopyButton from '@/components/common/copy_button';
import { IJsonRpcTransaction } from '@/interfaces/rpc';
import { formatRpcTransaction } from '@/lib/utils/format';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';

const TransactionItem = ({ txn }: { txn: ITransaction }) => {
  const params = useParams();
  const chainId = params?.chainId as string;

  const transactionPath = `/chain/${chainId}/txs/${txn.hash}`;
  const blockPath = `/chain/${chainId}/blocks/${txn.blockNumber}`;
  const fromPath = `/chain/${chainId}/address/${txn.fromLabel}`;
  const toPath = `/chain/${chainId}/address/${txn.toLabel}`;

  const timestamp = new Date(parseInt(txn.timestamp) * 1000).toLocaleString();
  const validTimestamp = !!timestamp ? timestamp : txn.time;
  const datePart = validTimestamp.split(' ')[0];
  const timePart = validTimestamp.split(' ')[1];

  const truncatedFrom = txn.from.startsWith('0x') ? truncateAddress(txn.from) : txn.from;
  const truncatedTo = txn.to.startsWith('0x') ? truncateAddress(txn.to) : txn.to;

  const displayFrom = !!txn.from ? (
    <div className="flex items-center gap-1.5">
      <Link href={fromPath} className="font-mono text-[#5841D8] hover:underline">
        {truncatedFrom}
      </Link>
      <CopyButton value={txn.from} />
    </div>
  ) : (
    <p className="font-mono text-gray-600">Unknown</p>
  );
  const displayTo = !!txn.to ? (
    <div className="flex items-center gap-1.5">
      <Link href={toPath} className="font-mono text-[#5841D8] hover:underline">
        {truncatedTo}
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
      <td className="px-3 py-5">
        <Link href={transactionPath} className="font-mono text-[#5841D8]" title={txn.hash}>
          {truncateAddress(txn.hash, 8, 6)}
        </Link>
      </td>
      <td className="px-3 py-5">{displayedMethod}</td>
      <td className="px-3 py-5 text-xs">{displayedDescription}</td>
      <td className="px-3 py-5">
        <Link href={blockPath} className="font-bold text-[#5841D8] hover:underline">
          {txn.blockNumber}
        </Link>
      </td>
      <td className="px-3 py-5 whitespace-nowrap text-gray-600">{displayTime}</td>
      <td className="px-3 py-5">{displayFrom}</td>
      <td className="text-center">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-500">
          <ArrowRight size={14} />
        </div>
      </td>
      <td className="px-3 py-5">{displayTo}</td>
      <td className="px-3 py-5 font-bold text-gray-900">{txn.value}</td>
      <td className="px-3 py-5 text-gray-500">{txn.fee}</td>
    </tr>
  );
};

const TransactionTable = () => {
  const params = useParams();
  const chainId = params?.chainId as string;

  const { getLatestBlockNumber, getBlocksBatch, isLoading, error: rpcError } = useEthRpc(chainId);

  const [error, setError] = useState<string | null>();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [txnTotalCount, setTxnTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchTransactionList = async () => {
      try {
        // 1. 取得最新高度
        const latestHex = await getLatestBlockNumber();
        if (!latestHex) return;

        const latestBn = BigInt(latestHex);
        const BLOCKS_TO_SCAN = 50;

        // 2. 準備要掃描的區塊高度陣列
        const heights = Array.from({ length: BLOCKS_TO_SCAN })
          .map((_, i) => latestBn - BigInt(i))
          .filter((h) => h >= 0n);

        // 3. 批量抓取區塊 (包含完整交易物件)
        // 注意：這裡 Hook 內部的 getBlocksBatch 需要傳入 full = true
        const res = await getBlocksBatch(heights, true);
        const blocks = res ? res.map((item) => item.result).filter((res) => res !== undefined) : [];

        if (blocks) {
          // 4. 平坦化所有區塊中的交易並轉換格式
          const allCollectedTxns = blocks.flatMap((block) => {
            const txs = (block.transactions as IJsonRpcTransaction[]) || [];
            return txs.map((tx) => formatRpcTransaction(tx, block.timestamp, block.number));
          });

          // 5. 排序並更新狀態
          // 由於 getBlocksBatch 回傳順序可能不保證，建議保留排序
          const sortedTxns = allCollectedTxns.sort(
            (a, b) => Number(b.timestamp) - Number(a.timestamp)
          );

          setTransactions(sortedTxns);
          setTxnTotalCount(sortedTxns.length);
        }
      } catch (err: unknown) {
        console.error('Fetch transaction list error:', err);
        setError(err as string);
      }
    };

    fetchTransactionList();
  }, [chainId]);

  // Info: (20260202 - Julian) 發生錯誤
  if (rpcError || error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500">{rpcError || error}</p>
      </div>
    );
  }

  const isDisplayedTable = isLoading ? (
    // Info: (20260202 - Julian) 載入中
    <tr>
      <td colSpan={10} className="p-10 text-center font-semibold">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-600" />
      </td>
    </tr>
  ) : transactions.length === 0 ? (
    // Info: (20260202 - Julian) 無資料
    <tr>
      <td colSpan={10} className="p-10 text-center font-semibold">
        <p className="text-gray-900">尚無數據</p>
      </td>
    </tr>
  ) : (
    // Info: (20260202 - Julian) 渲染交易列表
    transactions.map((txn) => <TransactionItem key={txn.hash} txn={txn} />)
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Info: (20260130 - Julian) Table Header / Pagination Info */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4 text-sm text-gray-500">
        <div>
          近 24 小時內共計 <span className="font-medium text-gray-900">{txnTotalCount}</span>{' '}
          條交易記錄
        </div>
      </div>

      {/* Info: (20260130 - Julian) Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-3 py-4">交易雜湊</th>
              <th className="px-3 py-4">方法</th>
              <th className="px-3 py-4">交易描述</th>
              <th className="px-3 py-4">區塊</th>
              <th className="px-3 py-4 text-[#5841D8]">時間</th>
              <th className="px-3 py-4">發送方</th>
              <th className="px-4 py-4 text-center" aria-label="Transaction Direction"></th>
              <th className="px-3 py-4">接收方</th>
              <th className="px-3 py-4">數量</th>
              <th className="px-3 py-4">手續費</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">{isDisplayedTable}</tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
