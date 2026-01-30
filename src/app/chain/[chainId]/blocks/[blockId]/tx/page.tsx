'use client';

import { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { IJsonRpcBlock, IJsonRpcTransaction } from '@/interfaces/rpc';
import { formatHexToEther, truncateAddress } from '@/lib/utils/format';
import { getMethodDescription } from '@/lib/utils/transaction';
import CopyButton from '@/components/common/copy_button';
import BlockDetailHeader, { BlockDetailTabType } from '@/components/block/block_detail_header';
import Toggle from '@/components/common/toggle';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';

interface IBlockTransactionsPageProps {
  params: Promise<{
    chainId: string;
    blockId: string;
  }>;
}

const TransactionItem = ({ tx }: { tx: IJsonRpcTransaction }) => {
  const params = useParams();
  const { chainId } = params;

  const txDetailPath = `/chain/${chainId}/txs/${tx.hash}`;
  const fromPath = `/chain/${chainId}/address/${tx.from}`;

  const method = getMethodDescription(tx.input);
  const fee = formatHexToEther(
    (BigInt(tx.gas || '0x0') * BigInt(tx.gasPrice || '0x0')).toString(16)
  );

  const displayTo = tx.to ? (
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
  );

  return (
    <tr key={tx.hash} className="transition-colors hover:bg-gray-50/50">
      <td className="px-6 py-4">
        <Link href={txDetailPath} className="font-mono text-[#5841D8] hover:underline">
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
          <Link href={fromPath} className="font-mono text-[#5841D8] hover:underline">
            {truncateAddress(tx.from)}
          </Link>
          <CopyButton value={tx.from} />
        </div>
      </td>
      <td className="px-1 py-4 text-center">
        <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-500">
          <ArrowRight size={12} />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">{displayTo}</div>
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
};

export default function BlockTransactionsPage(props: IBlockTransactionsPageProps) {
  const params = use(props.params);
  const { chainId, blockId } = params;
  const router = useRouter();

  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [block, setBlock] = useState<IJsonRpcBlock | null>(null);
  const [transactions, setTransactions] = useState<IJsonRpcTransaction[]>([]);

  // Filtering & Pagination
  const [filteredTransactions, setFilteredTransactions] = useState<IJsonRpcTransaction[]>([]);
  const [hideZeroValue, setHideZeroValue] = useState<boolean>(false);

  const toggleHideZeroValue = () => {
    setHideZeroValue((prev) => !prev);
    setFilteredTransactions(
      hideZeroValue ? transactions : transactions.filter((tx) => BigInt(tx.value) > 0n)
    );
  };

  const { getBlockByNumber, getBlockByHash, isLoading, error: rpcError } = useEthRpc(chainId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 參數預處理：判斷是 Hash 還是 Number
        const isHash = blockId.startsWith('0x') && blockId.length === 66;

        let result: IJsonRpcBlock | null = null;

        if (isHash) {
          // 直接調用 Hook 方法
          result = await getBlockByHash(blockId, true);
        } else {
          // 確保轉換為 Hex 格式
          const blockParam = blockId.startsWith('0x')
            ? blockId
            : `0x${BigInt(blockId).toString(16)}`;
          result = await getBlockByNumber(blockParam, true);
        }

        // 2. 處理結果
        if (result) {
          setBlock(result);
          setTransactions((result.transactions as IJsonRpcTransaction[]) || []);
          setFilteredTransactions((result.transactions as IJsonRpcTransaction[]) || []);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch block transactions:', err);
        setError(err as string);
      }
    };

    fetchData();
  }, [chainId, blockId]);

  const backBtn = (
    <button onClick={() => router.back()} className="mt-4 text-sm text-[#5841D8] hover:underline">
      返回上一頁
    </button>
  );

  // RPC 錯誤
  if (rpcError) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500">{rpcError}</p>
        {backBtn}
      </div>
    );
  }

  // 載入中
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
      </div>
    );
  }

  // 錯誤或找不到區塊
  if (error || !block) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500">{error || 'Block not found'}</p>
        {backBtn}
      </div>
    );
  }

  const blockNumber = BigInt(block.number);
  const totalCount = transactions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <BlockDetailHeader
          chainId={chainId}
          blockId={blockId}
          blockNumber={blockNumber}
          activeTab={BlockDetailTabType.TRANSACTIONS}
        />

        {/* Transaction Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-4">
            <p className="text-sm font-medium text-gray-600">共計 {totalCount} 條數據</p>
            {/* Toggle */}
            <Toggle
              isOpen={hideZeroValue}
              onToggle={toggleHideZeroValue}
              label={{
                open: '展示數量為 0 的交易',
                close: '展示數量為 0 的交易',
              }}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-4">交易哈希</th>
                  <th className="px-6 py-4">方法</th>
                  <th className="px-6 py-4">發送方</th>
                  <th className="w-8 px-6 py-4 text-center"></th>
                  <th className="px-6 py-4">接收方</th>
                  <th className="px-6 py-4">數量</th>
                  <th className="px-6 py-4 text-right">手續費</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => <TransactionItem key={tx.hash} tx={tx} />)
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
        </div>
      </div>
    </div>
  );
}
