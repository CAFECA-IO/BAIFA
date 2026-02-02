'use client';

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
import CopyButton from '@/components/common/copy_button';

interface ITransactionOverviewProps {
  chainId: string;
  tx: IJsonRpcTransaction;
  receipt: IJsonRpcReceipt;
  block: IJsonRpcBlock;
  latestBlockNumber: string;
}

const TransactionOverview = ({
  chainId,
  tx,
  receipt,
  block,
  latestBlockNumber,
}: ITransactionOverviewProps) => {
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
