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
import ErrorState from '@/components/common/error_state';
import { rpcService } from '@/lib/services/rpc_service';
import TokenTransferList, { ITokenTransfer } from '@/components/transaction/token_transfer_list';
import { parseRpcString, extractRawTransfers } from '@/lib/utils/log_parser';

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
  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>([]);

  const { executeBatch, getBlockByNumber, isLoading, error: rpcError } = useEthRpc(chainId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- 階段 1: 基礎資料抓取 (互不依賴) ---
        const firstBatch = [
          rpcService.getBlockNumber(),
          rpcService.getTransactionByHash(txId),
          rpcService.getTransactionReceipt(txId),
        ];

        const firstRes = await executeBatch<string | IJsonRpcTransaction | IJsonRpcReceipt>(
          firstBatch
        );
        const [latestBn, txData, receiptData] = firstRes?.map((r) => r.result) || [];

        if (!txData || !receiptData) {
          setError('找不到交易或收據資訊');
          return;
        }

        // 更新基礎狀態
        setLatestBlockNumber(latestBn as string);
        setTx(txData as IJsonRpcTransaction);
        setReceipt(receiptData as IJsonRpcReceipt);

        // --- 階段 2: 依賴型資料抓取 (區塊與代幣元數據) ---

        // 2a. 抓取區塊詳情
        const blockPromise = getBlockByNumber((receiptData as IJsonRpcReceipt).blockNumber, false);

        // 2b. 解析 Logs 並過濾出 ERC20 Transfer
        const rawTransfers = extractRawTransfers((receiptData as IJsonRpcReceipt).logs || []);
        const uniqueTokenAddresses = Array.from(new Set(rawTransfers.map((t) => t.tokenAddress)));

        // 2c. 準備代幣 MetaData 請求
        const tokenMetaRequests = uniqueTokenAddresses.flatMap((addr) => [
          rpcService.getErc20Symbol(addr),
          rpcService.getErc20Decimals(addr),
        ]);

        // 併發執行：區塊抓取與代幣 Meta 抓取
        const [blockData, metaResponses] = await Promise.all([
          blockPromise,
          tokenMetaRequests.length > 0
            ? executeBatch<string>(tokenMetaRequests)
            : Promise.resolve([]),
        ]);

        if (blockData) setBlock(blockData);

        // --- 階段 3: 資料整合與映射 ---

        // 建立代幣資訊映射表
        const tokenMap: Record<string, { symbol: string; decimals: number }> = {};
        uniqueTokenAddresses.forEach((addr, i) => {
          if (metaResponses) {
            const symbolRes = metaResponses[i * 2]?.result;
            const decimalsRes = metaResponses[i * 2 + 1]?.result;

            tokenMap[addr.toLowerCase()] = {
              symbol: parseRpcString(symbolRes) || 'Unknown',
              decimals: decimalsRes ? parseInt(decimalsRes, 16) : 18,
            };
          }
        });

        // 組合成最終的 Token Transfers 列表
        const finalTransfers = rawTransfers.map((t) => {
          const meta = tokenMap[t.tokenAddress.toLowerCase()];
          return {
            ...t,
            tokenSymbol: meta.symbol,
            tokenDecimals: meta.decimals,
          };
        });

        setTokenTransfers(finalTransfers); // 這是傳給 <TokenTransferList /> 的資料
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
      <ErrorState
        message={error || rpcError}
        onRetry={() => window.location.reload()}
        showContainer
      />
    );
  }

  if (!block) {
    return (
      <ErrorState
        title="找不到區塊"
        message="無法取得該交易對應的區塊資訊"
        onRetry={() => window.location.reload()}
        showContainer
      />
    );
  }

  if (!tx || !receipt) {
    return (
      <ErrorState
        title="找不到交易"
        message="無法取得該交易或收據的詳細資訊"
        onRetry={() => window.location.reload()}
        showContainer
      />
    );
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

        {/* Info: (20260203 - Julian) Token Transfers */}
        <TokenTransferList chainId={chainId} transfers={tokenTransfers} />

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
