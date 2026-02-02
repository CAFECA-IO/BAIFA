'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, FileText, Clock } from 'lucide-react';
import {
  formatHexToDecimal,
  formatTimestamp,
  formatFullTimestamp,
  formatHexToEther,
  formatHexToGwei,
} from '@/lib/utils/format';
import { IJsonRpcTransaction, IJsonRpcReceipt, IJsonRpcBlock } from '@/interfaces/rpc';
import { getMethodDescription, getTransactionDescription } from '@/lib/utils/transaction';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';
import CopyButton from '@/components/common/copy_button';
import { rpcService } from '@/lib/services/rpc_service';

interface ITransactionOverviewProps {
  chainId: string;
  txId: string;
}

const TransactionOverview = ({ chainId, txId }: ITransactionOverviewProps) => {
  const [error, setError] = useState<string | null>(null);

  const [tx, setTx] = useState<IJsonRpcTransaction | null>(null);
  const [receipt, setReceipt] = useState<IJsonRpcReceipt | null>(null);
  const [block, setBlock] = useState<IJsonRpcBlock | null>(null);
  const [latestBlockNumber, setLatestBlockNumber] = useState<string | null>(null);

  const { executeBatch, getBlockByNumber, isLoading, error: rpcError } = useEthRpc(chainId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Info: (20260202 - Julian) 1. 第一階段：Batch 抓取互不依賴的資料
        const batchRequests = [
          rpcService.getBlockNumber(), // Info: (20260202 - Julian) 取得最新高度
          rpcService.getTransactionByHash(txId), // Info: (20260202 - Julian) 取得交易內容
          rpcService.getTransactionReceipt(txId), // Info: (20260202 - Julian) 取得交易收據
        ];

        const res = await executeBatch<string | IJsonRpcTransaction | IJsonRpcReceipt>(
          batchRequests
        );
        const results = res
          ? res.map((item) => item.result).filter((res) => res !== undefined)
          : [];

        if (!results || results.length < 3) return;

        const [latestBn, txResult, receiptResult] = results;

        // Info: (20260202 - Julian) 2. 處理第一階段結果
        if (latestBn && typeof latestBn === 'string') setLatestBlockNumber(latestBn);

        if (!txResult) {
          // Info: (20260202 - Julian) 這裡可以處理業務邏輯錯誤
          setTx(null);
          setReceipt(null);
          setBlock(null);
          setLatestBlockNumber(null);

          setError('Transaction not found');
          return;
        }

        if (txResult && typeof txResult === 'object') setTx(txResult as IJsonRpcTransaction);
        if (receiptResult && typeof receiptResult === 'object')
          setReceipt(receiptResult as IJsonRpcReceipt);

        // Info: (20260202 - Julian) 3. 第二階段：根據第一階段拿到的 blockNumber 抓取區塊詳情
        const blockNumber =
          (txResult as IJsonRpcReceipt).blockNumber ||
          (receiptResult as IJsonRpcReceipt).blockNumber;
        if (blockNumber) {
          const blockData = await getBlockByNumber(blockNumber, false);
          if (blockData) setBlock(blockData);
        }
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transaction details');
      }
    };

    if (chainId && txId) {
      fetchData();
    }
  }, [chainId, txId]);

  // Info: (20260202 - Julian) Render Loading Skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-gray-500">
              <tr>
                <th className="pb-4 font-medium">地址</th>
                <th className="pb-4 font-medium">交易前</th>
                <th className="pb-4 font-medium">交易後</th>
                <th className="pb-4 font-medium">狀態變化</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="py-4">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                  </td>
                  <td className="py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                      <div className="h-3 w-16 animate-pulse rounded bg-gray-50" />
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                      <div className="h-3 w-16 animate-pulse rounded bg-gray-50" />
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Info: (20260202 - Julian) Render Error State
  if (error || rpcError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-red-50 py-10 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
          <XCircle size={28} />
        </div>
        <h3 className="mb-1 text-lg font-semibold text-red-900">數據加載失敗</h3>
        <p className="max-w-md text-sm text-red-600">{error || rpcError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg active:scale-95"
        >
          重試
        </button>
      </div>
    );
  }

  if (!block) {
    return <div className="py-10 text-center text-red-500">Block not found</div>;
  }

  if (!tx || !receipt) {
    return <div className="py-10 text-center text-red-500">Transaction not found</div>;
  }

  // Info: (20260130 - Julian) --- Helpers for Display ---
  const isSuccess = receipt.status === '0x1';
  const statusColor = isSuccess ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  const statusIcon = isSuccess ? (
    <CheckCircle size={14} className="mr-1" />
  ) : (
    <XCircle size={14} className="mr-1" />
  );
  const statusText = isSuccess ? '成功' : '失敗';

  const blockNumberDec = formatHexToDecimal(receipt.blockNumber);

  let confirmations = null;
  if (latestBlockNumber && receipt.blockNumber) {
    confirmations = BigInt(latestBlockNumber) - BigInt(receipt.blockNumber) + 1n;
  }
  /**
   * Info: (20260130 - Julian) Assuming we don't have latest block number easily available here for confirmations count without another call,
   * but we can skip confirmations or fetch latest block if critical. User image has it.
   * For now let's show block number.
   */
  const timestamp = block?.timestamp ? formatFullTimestamp(block.timestamp) : '-';
  const timeAgo = block?.timestamp ? formatTimestamp(block.timestamp) : '-';

  const valEth = formatHexToEther(tx.value);
  const valEthFormatted = parseFloat(valEth).toLocaleString(undefined, {
    maximumFractionDigits: 18,
  });

  // Info: (20260130 - Julian) Gas Calculations
  const gasUsedDec = BigInt(receipt.gasUsed);
  const gasLimitDec = BigInt(tx.gas);
  const gasUsagePercent = Number((gasUsedDec * 10000n) / gasLimitDec) / 100;

  const effectiveGasPriceDec = BigInt(receipt.effectiveGasPrice || tx.gasPrice || 0);
  const txFeeWei = gasUsedDec * effectiveGasPriceDec;
  const txFeeEth = formatHexToEther('0x' + txFeeWei.toString(16));

  const gasPriceGwei = formatHexToGwei('0x' + effectiveGasPriceDec.toString(16));

  // Info: (20260130 - Julian) EIP-1559 Fields
  const maxFeePerGasGwei = tx.maxFeePerGas ? formatHexToGwei(tx.maxFeePerGas) : null;
  const maxPriorityFeePerGasGwei = tx.maxPriorityFeePerGas
    ? formatHexToGwei(tx.maxPriorityFeePerGas)
    : null;

  let burntFeeEth = null;
  let savingsEth = null;

  if (block?.baseFeePerGas) {
    const baseFeeDec = BigInt(block.baseFeePerGas);
    const burntWei = gasUsedDec * baseFeeDec;
    burntFeeEth = formatHexToEther('0x' + burntWei.toString(16));

    if (tx.maxFeePerGas) {
      const maxFeeDec = BigInt(tx.maxFeePerGas);
      // Info: (20260130 - Julian) Savings = (MaxFee - EffectiveGasPrice) * GasUsed
      const savingsWei = (maxFeeDec - effectiveGasPriceDec) * gasUsedDec;
      if (savingsWei > 0n) {
        savingsEth = formatHexToEther('0x' + savingsWei.toString(16));
      }
    }
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
      <div className="divide-y divide-gray-100">
        <div>
          {/* Info: (20260130 - Julian) Transaction Hash */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="flex w-full items-center gap-1 text-sm text-gray-500 sm:w-1/4">
              <FileText size={14} className="text-gray-400" /> 交易雜湊 :
            </div>
            <div className="flex items-center gap-2 font-mono text-sm text-gray-900">
              {tx.hash} <CopyButton value={tx.hash} />
            </div>
          </div>

          {/* Info: (20260130 - Julian) Status */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">交易結果 :</div>
            <div>
              <span
                className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
              >
                {statusIcon} {statusText}
              </span>
            </div>
          </div>

          {/* Info: (20260130 - Julian) Block */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">區塊 :</div>
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={`/chain/${chainId}/blocks/${blockNumberDec}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {blockNumberDec}
              </Link>
              {confirmations !== null && (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-green-600">
                  {confirmations.toString()} 個區塊已確認
                </span>
              )}
            </div>
          </div>

          {/* Info: (20260130 - Julian) Timestamp */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">時間 :</div>
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <Clock size={14} className="text-gray-400" />
              {timeAgo} ({timestamp})
            </div>
          </div>
        </div>

        <div>
          {/* Info: (20260130 - Julian) From */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">發送方 :</div>
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={`/chain/${chainId}/address/${tx.from}`}
                className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
              >
                {tx.from}
              </Link>
              <CopyButton value={tx.from} />
            </div>
          </div>

          {/* Info: (20260130 - Julian) To */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">接收方 :</div>
            <div className="flex items-center gap-2 text-sm">
              {tx.to ? (
                <>
                  <Link
                    href={`/chain/${chainId}/address/${tx.to}`}
                    className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {tx.to}
                  </Link>
                  <CopyButton value={tx.to} />
                </>
              ) : (
                <span className="text-gray-900">合約創建</span>
              )}
            </div>
          </div>
        </div>

        <div>
          {/* Info: (20260130 - Julian) Value */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">交易數量 :</div>
            <div className="text-sm font-medium text-gray-900">{valEthFormatted} ETH</div>
          </div>

          {/* Info: (20260130 - Julian) Transaction Fee */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">交易手續費 :</div>
            <div className="text-sm text-gray-900">{txFeeEth} ETH</div>
          </div>
        </div>

        <div>
          {/* Info: (20260130 - Julian) Gas Price */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">Gas 價格 :</div>
            <div className="text-sm text-gray-900">
              {formatHexToDecimal(receipt.effectiveGasPrice)} Wei ({gasPriceGwei} Gwei)
            </div>
          </div>

          {/* Info: (20260130 - Julian) Gas Limit & Usage */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">Gas 限額 & Gas 消耗 :</div>
            <div className="text-sm text-gray-900">
              {gasLimitDec.toLocaleString()} | {gasUsedDec.toLocaleString()} (
              {gasUsagePercent.toFixed(2)}%)
            </div>
          </div>

          {/* Info: (20260130 - Julian) Gas Fees (EIP-1559) */}
          {(maxFeePerGasGwei || maxPriorityFeePerGasGwei) && (
            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
              <div className="w-full text-sm text-gray-500 sm:w-1/4">Gas 費 :</div>
              <div className="text-sm text-gray-900">
                {block?.baseFeePerGas && (
                  <span className="mr-3">
                    基礎費用: {formatHexToGwei(block.baseFeePerGas)} Gwei
                  </span>
                )}
                {maxPriorityFeePerGasGwei && (
                  <span className="mr-3 text-gray-500">
                    最大小費: {maxPriorityFeePerGasGwei} Gwei
                  </span>
                )}
                {maxFeePerGasGwei && (
                  <span className="text-gray-500">最大附加費: {maxFeePerGasGwei} Gwei</span>
                )}
              </div>
            </div>
          )}

          {/* Info: (20260130 - Julian) Burnt & Savings */}
          {(burntFeeEth || savingsEth) && (
            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
              <div className="w-full text-sm text-gray-500 sm:w-1/4">銷毀手續費 & 手續費找零 :</div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-900">
                {burntFeeEth && (
                  <span className="flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-orange-700">
                    🔥 銷毀手續費 : {burntFeeEth} ETH
                  </span>
                )}
                {savingsEth && (
                  <span className="flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-green-700">
                    💸 手續費找零 : {savingsEth} ETH
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Info: (20260130 - Julian) Other Info */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">其他信息 :</div>
            <div className="flex flex-col gap-2 text-sm text-gray-900 sm:w-3/4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">方法:</span>{' '}
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs">
                    {getMethodDescription(tx.input)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">描述:</span>{' '}
                  <span>{getTransactionDescription(tx)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">交易類型:</span>{' '}
                  {receipt.type === '0x2' ? '2 (EIP-1559)' : receipt.type}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Nonce:</span> {formatHexToDecimal(tx.nonce)}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">位置:</span>{' '}
                  {formatHexToDecimal(receipt.transactionIndex)}
                </div>
              </div>
            </div>
          </div>

          {/* Info: (20260130 - Julian) Input Data */}
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
            <div className="w-full text-sm text-gray-500 sm:w-1/4">輸入數據 :</div>
            <div className="w-full overflow-hidden text-sm sm:w-3/4">
              <div className="rounded-md bg-gray-50 p-3 font-mono break-all text-gray-600">
                {tx.input}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionOverview;
