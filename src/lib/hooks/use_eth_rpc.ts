import { useState, useCallback } from 'react';
import { rpcService } from '@/lib/services/rpc_service';
import { fetchApi } from '@/lib/services/api_service';
import {
  IJsonRpcBlock,
  IJsonRpcReceipt,
  IJsonRpcResponse,
  IJsonRpcTransaction,
} from '@/interfaces/rpc';

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

  // Info: (20260130 - Julian) 內部的通用請求處理器
  const execute = useCallback(
    async <T>(requestBody: IRpcBody): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      try {
        // Info: (20260130 - Julian) 自動注入動態 ID 防止 Request 衝突
        const bodyWithId = { ...requestBody, id: Math.floor(Math.random() * 100000) };

        const res = await fetchApi<IJsonRpcResponse<T>>(url, {
          method: 'POST',
          body: JSON.stringify(bodyWithId),
        });

        if (res.error) throw new Error(res.error.message);
        return res.result;
      } catch (err: unknown) {
        // Info: (20260130 - Julian) 使用 instanceof 檢查類型
        if (err instanceof Error) {
          setError(err.message);
        } else {
          // Info: (20260130 - Julian) 處理非預期的錯誤類型（例如 throw "string"）
          setError('發生未知錯誤');
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [url]
  );

  // Info: (20260130 - Julian) 封裝具體方法
  // Info: (20260130 - Julian) 取得地址發送次數
  const getTxCount = useCallback(
    (address: string) => execute<string>(rpcService.getTransactionCount(address)),
    [execute]
  );

  // Info: (20260130 - Julian) 取得地址餘額
  const getBalance = useCallback(
    (address: string) => execute<string>(rpcService.getBalance(address)),
    [execute]
  );

  // Info: (20260130 - Julian) 取得交易收據
  const getTxReceipt = useCallback(
    (txHash: string) => execute<IJsonRpcReceipt>(rpcService.getTransactionReceipt(txHash)),
    [execute]
  );

  // Info: (20260130 - Julian) 透過雜湊取得交易
  const getTxByHash = useCallback(
    (txHash: string) => execute<IJsonRpcTransaction>(rpcService.getTransactionByHash(txHash)),
    [execute]
  );

  // Info: (20260130 - Julian) 透過高度取得區塊
  const getBlockByNumber = useCallback(
    (bn: string, full?: boolean) => execute<IJsonRpcBlock>(rpcService.getBlockByNumber(bn, full)),
    [execute]
  );

  // Info: (20260130 - Julian) 透過區塊雜湊與索引取得交易
  const getTxByBlockAndIndex = useCallback(
    (hash: string, index: number) => {
      const indexHex = `0x${index.toString(16)}`;
      return execute<IJsonRpcTransaction>(
        rpcService.getTransactionByBlockHashAndIndex(hash, indexHex)
      );
    },
    [execute]
  );

  // Info: (20260130 - Julian) 取得最新高度
  const getLatestBlockNumber = useCallback(
    () => execute<string>(rpcService.getBlockNumber()),
    [execute]
  );

  // Info: (20260130 - Julian) 透過雜湊取得區塊
  const getBlockByHash = useCallback(
    (blockHash: string, full: boolean = true) =>
      execute<IJsonRpcBlock>(rpcService.getBlockByHash(blockHash, full)),
    [execute]
  );

  return {
    isLoading,
    error,
    getTxCount,
    getBalance,
    getTxReceipt,
    getTxByHash,
    getBlockByNumber,
    getTxByBlockAndIndex,
    getLatestBlockNumber,
    getBlockByHash,
  };
};
