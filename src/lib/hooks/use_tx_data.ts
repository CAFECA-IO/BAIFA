import { useState, useEffect, useCallback } from 'react';
import { IAlchemyTransaction } from '@/interfaces/alchemy';
import { TransactionCategory } from '@/constants/transaction_category';

enum TransactionType {
  FROM = 'from',
  TO = 'to',
}

/**
 * Info: (20260205 - Julian) 取得指定位址的交易紀錄
 * Ref: https://www.alchemy.com/docs/data/transfers-api/transfers-endpoints/alchemy-get-asset-transfers
 * 使用 Alchemy 的 getAssetTransfers API 取得指定位址的交易紀錄
 */
export const useTransactionList = (
  address: string,
  chainId: string,
  categories: TransactionCategory[] = [TransactionCategory.EXTERNAL] // Info: (20260205 - Julian) 預設為一般交易
) => {
  const [transactions, setTransactions] = useState<IAlchemyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Info: (20260205 - Julian) 使用 Alchemy 的 getAssetTransfers API
  const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL;

  const fetchTransactions = useCallback(async () => {
    if (!address || !alchemyUrl) return;
    setIsLoading(true);

    // Info: (20260205 - Julian) 準備請求 Body 的工具函式
    const getBody = (type: TransactionType) => ({
      jsonrpc: '2.0',
      id: type === TransactionType.FROM ? 1 : 2,
      method: 'alchemy_getAssetTransfers',
      params: [
        {
          fromBlock: '0x0',
          toBlock: 'latest',
          [type === TransactionType.FROM ? 'fromAddress' : 'toAddress']: address,
          category: categories,
          withMetadata: true,
          excludeZeroValue: true,
        },
      ],
    });

    try {
      // Info: (20260205 - Julian) 同時發送兩個請求
      const [resFrom, resTo] = await Promise.all([
        fetch(alchemyUrl, { method: 'POST', body: JSON.stringify(getBody(TransactionType.FROM)) }),
        fetch(alchemyUrl, { method: 'POST', body: JSON.stringify(getBody(TransactionType.TO)) }),
      ]);

      const dataFrom = await resFrom.json();
      const dataTo = await resTo.json();

      const transfersFrom = dataFrom.result?.transfers || [];
      const transfersTo = dataTo.result?.transfers || [];

      // Info: (20260205 - Julian) 合併、去重 (用 hash)、排序 (最新的在前面)
      const combined = [...transfersFrom, ...transfersTo];
      const uniqueSorted = combined
        .filter((tx, index, self) => index === self.findIndex((t) => t.hash === tx.hash))
        .sort((a, b) => parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16));

      setTransactions(uniqueSorted);
    } catch (err) {
      console.error('無法取得交易紀錄:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchTransactions();
  }, [address, chainId]);

  return { transactions, isLoading, refresh: fetchTransactions };
};
