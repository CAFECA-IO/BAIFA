import { useState, useCallback } from 'react';
import { rpcService } from '@/lib/services/rpc_service';
import { fetchApi } from '@/lib/services/api_service';
import { IJsonRpcResponse } from '@/interfaces/rpc';

interface IRpcBody {
  jsonrpc: string;
  method: string;
  params: unknown[];
  id: number;
}

export const useEthRpc = (chainId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const url = `/api/v1/chains/${chainId}`;

  // 內部的通用請求處理器
  const execute = useCallback(
    async <T>(requestBody: IRpcBody): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      try {
        // 自動注入動態 ID 防止 Request 衝突
        const bodyWithId = { ...requestBody, id: Math.floor(Math.random() * 100000) };

        const res = await fetchApi<IJsonRpcResponse<T>>(url, {
          method: 'POST',
          body: JSON.stringify(bodyWithId),
        });

        if (res.error) throw new Error(res.error.message);
        return res.result;
      } catch (err: unknown) {
        // 使用 instanceof 檢查類型
        if (err instanceof Error) {
          setError(err.message);
        } else {
          // 處理非預期的錯誤類型（例如 throw "string"）
          setError('發生未知錯誤');
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [url]
  );

  // 封裝具體方法
  const getTxCount = (address: string) => execute(rpcService.getTransactionCount(address));
  const getBalance = (address: string) => execute(rpcService.getBalance(address));
  const getTxReceipt = (txHash: string) => execute(rpcService.getTransactionReceipt(txHash));
  const getTxByHash = (txHash: string) => execute(rpcService.getTransactionByHash(txHash));
  const getBlockByNumber = (bn: string, full?: boolean) =>
    execute(rpcService.getBlockByNumber(bn, full));
  const getTxByBlockAndIndex = (hash: string, index: number) => {
    const indexHex = `0x${index.toString(16)}`;
    return execute(rpcService.getTransactionByBlockHashAndIndex(hash, indexHex));
  };

  return {
    isLoading,
    error,
    getTxCount,
    getBalance,
    getTxReceipt,
    getTxByHash,
    getBlockByNumber,
    getTxByBlockAndIndex,
  };
};
