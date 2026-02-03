'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IJsonRpcTransaction, IJsonRpcBlock, IJsonRpcReceipt } from '@/interfaces/rpc';
import { rpcService } from '@/lib/services/rpc_service';
import { formatHexToEther, formatBalanceChange } from '@/lib/utils/format';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';
import CopyButton from '@/components/common/copy_button';
import ErrorState from '@/components/common/error_state';

interface IAccountState {
  address: string;
  before: { balance: string; nonce: string }; // Info: (20260130 - Julian) at block - 1
  after: { balance: string; nonce: string }; // Info: (20260130 - Julian) at block
  change: string; // Info: (20260130 - Julian) difference in balance
  isMiner: boolean;
}

interface ITransactionStatus {
  chainId: string;
  txId: string;
}

const ListItem = ({ chainId, state }: { chainId: string; state: IAccountState }) => {
  return (
    <tr aria-label={`State change for ${state.address}`}>
      <td className="py-4 align-top">
        <div className="flex items-center gap-2">
          <Link
            href={`/chain/${chainId}/address/${state.address}`}
            className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
          >
            {state.address}
          </Link>
          <CopyButton value={state.address} />
          {state.isMiner && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">出塊者</span>
          )}
        </div>
      </td>
      <td className="py-4 align-top" aria-label="Before Transaction State">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{state.before.balance} ISC</span>
          <span className="text-xs text-gray-500">Nonce: {state.before.nonce}</span>
        </div>
      </td>
      <td className="py-4 align-top" aria-label="After Transaction State">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{state.after.balance} ISC</span>
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
          {state.change} ISC
        </span>
      </td>
    </tr>
  );
};

const TransactionStatus = ({ chainId, txId }: ITransactionStatus) => {
  const { executeBatch, getBlockByNumber, isLoading, error: rpcError } = useEthRpc(chainId);

  const [stateChanges, setStateChanges] = useState<IAccountState[]>([]);
  const [error, setError] = useState<string | null>();

  // Info: (20260202 - Julian) 分析狀態變化
  const runAnalysis = async (currentTx: IJsonRpcTransaction, currentBlock: IJsonRpcBlock) => {
    // Info: (20260202 - Julian) 1. 收集地址邏輯保持不變
    const addressList = Array.from(
      new Set(
        [
          currentTx.from?.toLowerCase(),
          currentTx.to?.toLowerCase(),
          currentBlock.miner?.toLowerCase(),
        ].filter(Boolean) as string[]
      )
    );

    const prevBnHex = `0x${(BigInt(currentBlock.number) - 1n).toString(16)}`;
    const currBnHex = currentBlock.number;

    // Info: (20260202 - Julian) 2. 構建請求
    const stateRequests = addressList.flatMap((addr) => [
      rpcService.getBalance(addr, prevBnHex),
      rpcService.getTransactionCount(addr, prevBnHex),
      rpcService.getBalance(addr, currBnHex),
      rpcService.getTransactionCount(addr, currBnHex),
    ]);

    const batchResponses = await executeBatch<string>(stateRequests);
    if (!batchResponses) return;

    // Info: (20260202 - Julian) 4. 安全提取數值的內部工具
    const safeExtract = (index: number, address: string, method: string): string => {
      const resp = batchResponses[index];
      if (resp?.error) {
        // Info: (20260202 - Julian) 鈍針對 missing trie node (-32000) 進行紀錄
        console.warn(`RPC 警告 [${address} - ${method}]: ${resp.error.message}`);
        return '0x0';
      }
      return resp?.result ?? '0x0';
    };

    // Info: (20260202 - Julian) 5. 解析結果
    const results: IAccountState[] = addressList.map((addr, i) => {
      const base = i * 4;

      // Info: (20260202 - Julian) 依序提取：前餘額、前 Nonce、後餘額、後 Nonce
      const balPrev = safeExtract(base, addr, 'getBalance_prev');
      const noncePrev = safeExtract(base + 1, addr, 'getNonce_prev');
      const balCurr = safeExtract(base + 2, addr, 'getBalance_curr');
      const nonceCurr = safeExtract(base + 3, addr, 'getNonce_curr');

      return {
        address: addr,
        before: {
          balance: formatHexToEther(balPrev),
          nonce: BigInt(noncePrev).toString(),
        },
        after: {
          balance: formatHexToEther(balCurr),
          nonce: BigInt(nonceCurr).toString(),
        },
        change: formatBalanceChange(balPrev, balCurr),
        isMiner: addr === currentBlock.miner?.toLowerCase(),
      };
    });

    setStateChanges(results);
  };

  useEffect(() => {
    const fetchStateChanges = async () => {
      try {
        // Info: (20260202 - Julian) --- 階段 1: 取得交易與收據 ---
        const firstBatch = [
          rpcService.getTransactionByHash(txId),
          rpcService.getTransactionReceipt(txId),
        ];

        // Info: (20260202 - Julian) 根據方法轉型
        const baseResponses = await executeBatch<IJsonRpcTransaction | IJsonRpcReceipt>(firstBatch);
        if (!baseResponses) return;

        // Info: (20260202 - Julian) 驗證回傳結果是否存在且無誤
        const txData = baseResponses[0]?.result as IJsonRpcTransaction | undefined;
        const receiptData = baseResponses[1]?.result as IJsonRpcReceipt | undefined;

        if (!txData || !receiptData) {
          console.error('無法取得交易或收據資訊');
          return;
        }

        /**
         * Info: (20260202 - Julian) --- 階段 2: 取得區塊詳情 ---
         * Info: (20260202 - Julian) 這裡我們需要 Block 裡的 miner 地址來判斷出塊者
         */
        const rawBlock = await getBlockByNumber(receiptData.blockNumber, false);
        if (!rawBlock) return;

        // Info: (20260202 - Julian) --- 階段 3: 執行狀態分析 (帶入強型別) ---
        await runAnalysis(txData, rawBlock);
      } catch (err: unknown) {
        console.error('Initialization failed:', err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchStateChanges();
  }, [chainId, txId]);

  // Info: (20260202 - Julian) Render Loading Skeleton
  if (isLoading)
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

  // Info: (20260202 - Julian) Render Error State
  if (error || rpcError)
    return (
      <ErrorState
        message={error || rpcError}
        onRetry={() => window.location.reload()}
        showContainer
      />
    );

  const displayedStateChanges =
    stateChanges.length > 0 ? (
      stateChanges.map((state) => <ListItem key={state.address} chainId={chainId} state={state} />)
    ) : (
      <tr>
        <td colSpan={10} className="p-10 text-center font-semibold">
          <p className="text-gray-900">尚無數據</p>
        </td>
      </tr>
    );

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
      <p className="mb-6 text-sm text-gray-500">
        以下信息展示了在網絡上處理交易時，相應地址當前狀態的變化情況
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-gray-500">
            <tr>
              <th className="pb-4 font-medium" aria-label="Address">
                地址
              </th>
              <th className="pb-4 font-medium" aria-label="Before Transaction">
                交易前
              </th>
              <th className="pb-4 font-medium" aria-label="After Transaction">
                交易後
              </th>
              <th className="pb-4 font-medium" aria-label="State Change">
                狀態變化
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">{displayedStateChanges}</tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionStatus;
