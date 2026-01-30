'use client';

import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import {
  IJsonRpcResponse,
  IJsonRpcTransaction,
  IJsonRpcReceipt,
  IJsonRpcBlock,
} from '@/interfaces/rpc';
import { fetchApi } from '@/lib/services/api_service'; // Assuming this exists based on usage in hooks
import {
  formatHexToDecimal,
  formatTimestamp,
  formatFullTimestamp,
  formatHexToEther,
  formatHexToGwei,
  truncateAddress,
} from '@/lib/utils/format';
import { getMethodDescription, getTransactionDescription } from '@/lib/utils/transaction';
import CopyButton from '@/components/common/copy_button';
import { CheckCircle, XCircle, FileText, Clock, ArrowLeft } from 'lucide-react';

interface ITransactionDetailsPageProps {
  params: Promise<{
    chainId: string;
    transactionId: string; // This is the hash
  }>;
}

interface IAccountState {
  address: string;
  before: { balance: string; nonce: string }; // at block - 1
  after: { balance: string; nonce: string }; // at block
  change: string; // difference in balance
  isMiner: boolean;
}

export default function TransactionDetailsPage(props: ITransactionDetailsPageProps) {
  const params = use(props.params);
  const { chainId, transactionId } = params;

  const [activeTab, setActiveTab] = useState<'overview' | 'status'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tx, setTx] = useState<IJsonRpcTransaction | null>(null);
  const [receipt, setReceipt] = useState<IJsonRpcReceipt | null>(null);
  const [block, setBlock] = useState<IJsonRpcBlock | null>(null);
  const [latestBlockNumber, setLatestBlockNumber] = useState<string | null>(null);

  const [stateChanges, setStateChanges] = useState<IAccountState[]>([]);
  const [loadingStateChanges, setLoadingStateChanges] = useState<boolean>(false);

  const txListPath = `/chain/${chainId}/txs`;

  useEffect(() => {
    if (activeTab === 'status' && stateChanges.length === 0 && tx && block) {
      const fetchStateChanges = async () => {
        setLoadingStateChanges(true);
        try {
          // Identify unique addresses: From, To, Miner
          const addresses = new Set<string>();
          if (tx.from) addresses.add(tx.from.toLowerCase());
          if (tx.to) addresses.add(tx.to.toLowerCase());
          if (block.miner) addresses.add(block.miner.toLowerCase());

          const uniqueAddresses = Array.from(addresses);
          const blockNumber = BigInt(block.number);
          const prevBlockNumberHex = `0x${(blockNumber - 1n).toString(16)}`;
          const currBlockNumberHex = block.number;

          const results: IAccountState[] = [];
          const url = `/api/v1/chains/${chainId}`;

          for (const addr of uniqueAddresses) {
            // Batch requests if possible, but sequential for simplicity here or use Promise.all
            const [balPrevRes, noncePrevRes, balCurrRes, nonceCurrRes] = await Promise.all([
              fetchApi<IJsonRpcResponse<string>>(url, {
                method: 'POST',
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_getBalance',
                  params: [addr, prevBlockNumberHex],
                  id: 10,
                }),
              }),
              fetchApi<IJsonRpcResponse<string>>(url, {
                method: 'POST',
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_getTransactionCount',
                  params: [addr, prevBlockNumberHex],
                  id: 11,
                }),
              }),
              fetchApi<IJsonRpcResponse<string>>(url, {
                method: 'POST',
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_getBalance',
                  params: [addr, currBlockNumberHex],
                  id: 12,
                }),
              }),
              fetchApi<IJsonRpcResponse<string>>(url, {
                method: 'POST',
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_getTransactionCount',
                  params: [addr, currBlockNumberHex],
                  id: 13,
                }),
              }),
            ]);

            const balPrev = BigInt(balPrevRes?.result ?? '0');
            const balCurr = BigInt(balCurrRes?.result ?? '0');
            const noncePrev = BigInt(noncePrevRes?.result ?? '0');
            const nonceCurr = BigInt(nonceCurrRes?.result ?? '0');

            const diff = balCurr - balPrev;
            const sign = diff > 0n ? '+' : diff < 0n ? '' : ''; // negative number toString() includes sign
            const diffEth = formatHexToEther(
              diff >= 0n ? `0x${diff.toString(16)}` : `-0x${(-diff).toString(16)}`
            );

            // Handle very small diffs that formatHexToEther might truncate if not careful,
            // but formatHexToEther uses ethers.formatEther which handles it well.
            // Manually add sign for display if positive
            const changeDisplay = diff === 0n ? '0 ETH' : `${sign}${diffEth}`;

            results.push({
              address: addr,
              before: {
                balance: formatHexToEther(balPrevRes?.result ?? '0x0'),
                nonce: noncePrev.toString(),
              },
              after: {
                balance: formatHexToEther(balCurrRes?.result ?? '0x0'),
                nonce: nonceCurr.toString(),
              },
              change: changeDisplay,
              isMiner: addr.toLowerCase() === block.miner.toLowerCase(),
            });
          }

          setStateChanges(results);
        } catch (e) {
          console.error('Failed to fetch state changes', e);
        } finally {
          setLoadingStateChanges(false);
        }
      };

      fetchStateChanges();
    }
  }, [activeTab, stateChanges.length, tx, block, chainId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/v1/chains/${chainId}`;

        // 0. Fetch Latest Block (for confirmations)
        const latestBnRes = await fetchApi<IJsonRpcResponse<string>>(url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 0,
          }),
        });
        if (latestBnRes.result) {
          setLatestBlockNumber(latestBnRes.result);
        }

        // 1. Fetch Transaction
        const txRes = await fetchApi<IJsonRpcResponse<IJsonRpcTransaction>>(url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [transactionId],
            id: 1,
          }),
        });

        if (!txRes.result) {
          setError('Transaction not found');
          setLoading(false);
          return;
        }
        setTx(txRes.result);

        // 2. Fetch Receipt
        const receiptRes = await fetchApi<IJsonRpcResponse<IJsonRpcReceipt>>(url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [transactionId],
            id: 2,
          }),
        });
        setReceipt(receiptRes.result);

        // 3. Fetch Block (if we have tx or receipt with block number)
        // Receipt reliably has blockNumber if confirmed
        const blockNumber = txRes.result.blockNumber || receiptRes.result?.blockNumber;
        if (blockNumber) {
          const blockRes = await fetchApi<IJsonRpcResponse<IJsonRpcBlock>>(url, {
            method: 'POST',
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBlockByNumber',
              params: [blockNumber, false], // false for tx objects not needed
              id: 3,
            }),
          });
          setBlock(blockRes.result);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch transaction details:', err);
        setError('Failed to fetch transaction details');
      } finally {
        setLoading(false);
      }
    };

    if (chainId && transactionId) {
      fetchData();
    }
  }, [chainId, transactionId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !tx || !receipt) {
    return <div className="py-10 text-center text-red-500">{error || 'Transaction not found'}</div>;
  }

  // --- Helpers for Display ---
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
  // Assuming we don't have latest block number easily available here for confirmations count without another call,
  // but we can skip confirmations or fetch latest block if critical. User image has it.
  // For now let's show block number.

  const timestamp = block?.timestamp ? formatFullTimestamp(block.timestamp) : '-';
  const timeAgo = block?.timestamp ? formatTimestamp(block.timestamp) : '-';

  const valEth = formatHexToEther(tx.value);
  const valEthFormatted = parseFloat(valEth).toLocaleString(undefined, {
    maximumFractionDigits: 18,
  });

  // Gas Calculations
  const gasUsedDec = BigInt(receipt.gasUsed);
  const gasLimitDec = BigInt(tx.gas);
  const gasUsagePercent = Number((gasUsedDec * 10000n) / gasLimitDec) / 100;

  const effectiveGasPriceDec = BigInt(receipt.effectiveGasPrice || tx.gasPrice || 0);
  const txFeeWei = gasUsedDec * effectiveGasPriceDec;
  const txFeeEth = formatHexToEther('0x' + txFeeWei.toString(16));

  const gasPriceGwei = formatHexToGwei('0x' + effectiveGasPriceDec.toString(16));

  // EIP-1559 Fields
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
      // Savings = (MaxFee - EffectiveGasPrice) * GasUsed
      const savingsWei = (maxFeeDec - effectiveGasPriceDec) * gasUsedDec;
      if (savingsWei > 0n) {
        savingsEth = formatHexToEther('0x' + savingsWei.toString(16));
      }
    }
  }

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="divide-y divide-gray-100">
            <div>
              {/* Transaction Hash */}
              <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
                <div className="flex w-full items-center gap-1 text-sm text-gray-500 sm:w-1/4">
                  <FileText size={14} className="text-gray-400" /> 交易哈希 :
                </div>
                <div className="flex items-center gap-2 font-mono text-sm text-gray-900">
                  {tx.hash} <CopyButton value={tx.hash} />
                </div>
              </div>

              {/* Status */}
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

              {/* Block */}
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

              {/* Timestamp */}
              <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
                <div className="w-full text-sm text-gray-500 sm:w-1/4">時間 :</div>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Clock size={14} className="text-gray-400" />
                  {timeAgo} ({timestamp})
                </div>
              </div>
            </div>

            <div>
              {/* From */}
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

              {/* To */}
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
              {/* Value */}
              <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
                <div className="w-full text-sm text-gray-500 sm:w-1/4">交易數量 :</div>
                <div className="text-sm font-medium text-gray-900">{valEthFormatted} ETH</div>
              </div>

              {/* Transaction Fee */}
              <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
                <div className="w-full text-sm text-gray-500 sm:w-1/4">交易手續費 :</div>
                <div className="text-sm text-gray-900">{txFeeEth} ETH</div>
              </div>
            </div>

            <div>
              {/* Gas Price */}
              <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
                <div className="w-full text-sm text-gray-500 sm:w-1/4">Gas 價格 :</div>
                <div className="text-sm text-gray-900">
                  {formatHexToDecimal(receipt.effectiveGasPrice)} Wei ({gasPriceGwei} Gwei)
                </div>
              </div>

              {/* Gas Limit & Usage */}
              <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
                <div className="w-full text-sm text-gray-500 sm:w-1/4">Gas 限額 & Gas 消耗 :</div>
                <div className="text-sm text-gray-900">
                  {gasLimitDec.toLocaleString()} | {gasUsedDec.toLocaleString()} (
                  {gasUsagePercent.toFixed(2)}%)
                </div>
              </div>

              {/* Gas Fees (EIP-1559) */}
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

              {/* Burnt & Savings */}
              {(burntFeeEth || savingsEth) && (
                <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
                  <div className="w-full text-sm text-gray-500 sm:w-1/4">
                    銷毀手續費 & 手續費找零 :
                  </div>
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
              {/* Other Info */}
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

              {/* Input Data */}
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
    }

    if (activeTab === 'status') {
      return (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <p className="mb-6 text-sm text-gray-500">
            以下信息展示了在網絡上處理交易時，相應地址當前狀態的變化情況
          </p>

          {loadingStateChanges ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : (
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
                  {stateChanges.map((state) => (
                    <tr key={state.address}>
                      <td className="py-4 align-top">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/chain/${chainId}/address/${state.address}`}
                            className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {truncateAddress(state.address)}
                          </Link>
                          <CopyButton value={state.address} />
                          {state.isMiner && (
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                              出塊者
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {state.before.balance} ETH
                          </span>
                          <span className="text-xs text-gray-500">Nonce: {state.before.nonce}</span>
                        </div>
                      </td>
                      <td className="py-4 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {state.after.balance} ETH
                          </span>
                          <span className="text-xs text-gray-500">Nonce: {state.after.nonce}</span>
                        </div>
                      </td>
                      <td className="py-4 align-top">
                        <span
                          className={`font-medium ${
                            state.change.startsWith('+')
                              ? 'text-green-600'
                              : state.change.startsWith('-')
                                ? 'text-red-600'
                                : 'text-gray-900'
                          }`}
                        >
                          {state.change} ETH
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href={txListPath} className="cursor-pointer text-gray-500 hover:text-gray-800">
            <ArrowLeft size={32} />
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">交易詳情</h1>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
              activeTab === 'overview'
                ? 'bg-black text-white'
                : 'bg-white text-gray-500 hover:text-gray-900'
            }`}
          >
            概覽
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
              activeTab === 'status'
                ? 'bg-black text-white'
                : 'bg-white text-gray-500 hover:text-gray-900'
            }`}
          >
            狀態
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
