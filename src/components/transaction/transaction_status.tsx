'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IJsonRpcTransaction, IJsonRpcBlock } from '@/interfaces/rpc';
import { rpcService } from '@/lib/services/rpc_service';
import { formatHexToEther, truncateAddress, formatBalanceChange } from '@/lib/utils/format';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';
import CopyButton from '@/components/common/copy_button';

interface IAccountState {
  address: string;
  before: { balance: string; nonce: string }; // Info: (20260130 - Julian) at block - 1
  after: { balance: string; nonce: string }; // Info: (20260130 - Julian) at block
  change: string; // Info: (20260130 - Julian) difference in balance
  isMiner: boolean;
}

interface ITransactionStatus {
  chainId: string;
  tx: IJsonRpcTransaction;
  block: IJsonRpcBlock;
}

const TransactionStatus = ({ chainId, tx, block }: ITransactionStatus) => {
  const [stateChanges, setStateChanges] = useState<IAccountState[]>([]);
  const [loadingStateChanges, setLoadingStateChanges] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const { executeBatch, isLoading, error: rpcError } = useEthRpc(chainId);

  useEffect(() => {
    if (stateChanges.length === 0 && tx && block) {
      const fetchStateChanges = async () => {
        setLoadingStateChanges(true);
        try {
          // 1. 收集唯一地址
          const uniqueAddresses = Array.from(
            new Set(
              [tx.from?.toLowerCase(), tx.to?.toLowerCase(), block.miner?.toLowerCase()].filter(
                Boolean
              ) as string[]
            )
          );

          const prevBlockHex = `0x${(BigInt(block.number) - 1n).toString(16)}`;
          const currBlockHex = block.number;

          // 2. 構建所有地址的 Batch 請求清單
          const batchRequests = uniqueAddresses.flatMap((addr) => [
            rpcService.getBalance(addr, prevBlockHex),
            rpcService.getTransactionCount(addr, prevBlockHex),
            rpcService.getBalance(addr, currBlockHex),
            rpcService.getTransactionCount(addr, currBlockHex),
          ]);

          // 3. 一次性發送並取得結果
          const rawResults = await executeBatch<string>(batchRequests);
          if (!rawResults || rawResults.length !== uniqueAddresses.length * 4) return;

          // 4. 解析結果並組裝狀態
          const stateResults: IAccountState[] = uniqueAddresses.map((addr, i) => {
            const baseIdx = i * 4;
            const [balPrev, noncePrev, balCurr, nonceCurr] = rawResults.slice(baseIdx, baseIdx + 4);

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
              isMiner: addr.toLowerCase() === block.miner.toLowerCase(),
            };
          });

          setStateChanges(stateResults);
        } catch (err: unknown) {
          console.error('Failed to fetch state changes', err);
          setError(err as string);
        } finally {
          setLoadingStateChanges(false);
        }
      };

      fetchStateChanges();
    }
  }, [stateChanges.length, tx, block, chainId]);

  if (isLoading) {
    return <div></div>;
  }

  if (error || rpcError) {
    return <div></div>;
  }

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
            <tbody className="divide-y divide-gray-50">
              {stateChanges.map((state) => (
                <tr key={state.address} aria-label={`State change for ${state.address}`}>
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
                  <td className="py-4 align-top" aria-label="Before Transaction State">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{state.before.balance} ETH</span>
                      <span className="text-xs text-gray-500">Nonce: {state.before.nonce}</span>
                    </div>
                  </td>
                  <td className="py-4 align-top" aria-label="After Transaction State">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{state.after.balance} ETH</span>
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
};

export default TransactionStatus;
