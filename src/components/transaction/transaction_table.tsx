'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ITransaction } from '@/interfaces/chain';
import { truncateAddress } from '@/lib/utils/format';
import { formatHexToEther } from '@/lib/utils/format';
import CopyButton from '@/components/common/copy_button';
import { IJsonRpcResponse, IJsonRpcBlock, IJsonRpcTransaction } from '@/interfaces/rpc';
import { fetchApi } from '@/lib/services/api_service';
import { getMethodDescription, getTransactionDescription } from '@/lib/utils/transaction';

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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [txnTotalCount, setTxnTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchTransactionList = async () => {
      try {
        setIsLoading(true);
        const url = `/api/v1/chains/${chainId}`;
        const BLOCKS_TO_SCAN = 50; // Info: (20260130 - Julian) 最多往前掃描 50 個區塊來湊交易

        // Info: (20260130 - Julian) 1. 取得當前最新區塊高度
        const bnRes = await fetchApi<IJsonRpcResponse<string>>(url, {
          method: 'POST',
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
        });
        const latestBn = BigInt(bnRes?.result ?? '0x0');

        let allCollectedTxns: ITransaction[] = [];

        // Info: (20260130 - Julian) 2. 解析描述函式 - now using shared utilities
        // Info: (20260130 - Julian) Imported at top of file

        // Info: (20260130 - Julian) 3. 執行批量抓取
        const blockPromises = [];
        for (let i = 0; i < BLOCKS_TO_SCAN; i++) {
          const targetBn = latestBn - BigInt(i);
          if (targetBn < 0n) break;

          blockPromises.push(
            fetchApi<IJsonRpcResponse<IJsonRpcBlock>>(url, {
              method: 'POST',
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBlockByNumber',
                params: [`0x${targetBn.toString(16)}`, true],
                id: i + 2,
              }),
            })
          );
        }

        const results = await Promise.all(blockPromises);

        // Info: (20260130 - Julian) 4. 整合所有區塊的交易
        results.forEach((res) => {
          const block = res.result;
          if (block && block.transactions) {
            const blockTxns: ITransaction[] = (block.transactions as IJsonRpcTransaction[]).map(
              (tx: IJsonRpcTransaction) => ({
                hash: tx.hash,
                description: getTransactionDescription(tx),
                method: getMethodDescription(tx.input),
                blockNumber: parseInt(block.number, 16).toString(),
                time: new Date(parseInt(block.timestamp, 16) * 1000).toLocaleString(),
                timestamp: parseInt(block.timestamp, 16).toString(),
                from: tx.from,
                to: tx.to || 'New Contract',
                value: `${parseFloat(formatHexToEther(tx.value)).toFixed(2)} ETH`,
                // Info: (20260130 - Julian) 估算手續費
                fee: `${parseFloat(formatHexToEther((BigInt(tx.gas || '0x0') * BigInt(tx.gasPrice || '0x0')).toString(16))).toFixed(8)} ETH`,
              })
            );
            allCollectedTxns = [...allCollectedTxns, ...blockTxns];
          }
        });

        // Info: (20260130 - Julian) 按區塊高度由大到小排序 (確保最新的在最上面)
        allCollectedTxns.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));
        setTransactions(allCollectedTxns);
        setTxnTotalCount(allCollectedTxns.length);
      } catch (error) {
        console.error('Fetch transaction list error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionList();
  }, [chainId]);

  const isDisplayedTable =
    !isLoading && transactions.length > 0 ? (
      transactions.map((txn) => <TransactionItem key={txn.hash} txn={txn} />)
    ) : (
      <tr>
        <td colSpan={10} className="p-10 text-center font-semibold">
          {isLoading ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-600" />
          ) : (
            <p className="text-gray-900">尚無數據</p>
          )}
        </td>
      </tr>
    );

  return (
    <>
      {/* {diaplayedFilters} */}
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
                <th className="px-6 py-4">交易雜湊</th>
                <th className="px-6 py-4">方法</th>
                <th className="px-6 py-4">交易描述</th>
                <th className="px-6 py-4">區塊</th>
                <th className="px-6 py-4 text-[#5841D8]">時間</th>
                <th className="px-6 py-4">發送方</th>
                <th className="px-4 py-4 text-center" aria-label="Transaction Direction"></th>
                <th className="px-6 py-4">接收方</th>
                <th className="px-6 py-4">數量</th>
                <th className="px-6 py-4">手續費</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">{isDisplayedTable}</tbody>
          </table>
        </div>

        {/* Info: (20260130 - Julian) Footer Pagination */}
        {/* <div className="flex items-center justify-end border-t border-gray-100 p-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        type={PaginationType.TEXT}
                    />
                </div> */}
      </div>
    </>
  );
};

export default TransactionTable;
