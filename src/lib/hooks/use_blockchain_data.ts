import { useState, useEffect } from 'react';
import { IJsonRpcBlock, IJsonRpcTransaction } from '@/interfaces/rpc';
import { IBlock, ITransaction } from '@/interfaces/chain';
import {
  formatHexToDecimal,
  formatTimestamp,
  formatFullTimestamp,
  formatHexToEther,
  formatHexToGwei,
  formatHexToMwei,
} from '@/lib/utils/format';
import { getMethodDescription } from '@/lib/utils/transaction';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';
import { rpcService } from '@/lib/services/rpc_service';
import { formatUnits } from 'ethers';

export function useBlockchainData(chainId: string) {
  const { execute, getBlocksBatch } = useEthRpc(chainId);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setError(null); // Info: (20260205 - Julian) 每次重新整理前清除舊錯誤

    try {
      // Info: (20260205 - Julian) 1. 先抓最新區塊高度
      const latestHex = await execute<string>(rpcService.getBlockNumber());
      if (!latestHex) return;
      const latestNum = BigInt(latestHex);

      // Info: (20260205 - Julian) 2. 準備批次請求最近 10 個區塊
      const heights = Array.from({ length: 10 }).map((_, i) => latestNum - BigInt(i));
      const blockResults = await getBlocksBatch(heights, true);

      // Info: (20260205 - Julian) 3. 過濾掉失敗的請求
      const validBlocks = blockResults
        ? blockResults.map((res) => res.result).filter((b): b is IJsonRpcBlock => !!b)
        : [];

      // Info: (20260205 - Julian) 4. 整理區塊資料並存入狀態
      const formattedBlocks: IBlock[] = validBlocks.map((block) => {
        const gasUsed = BigInt(block.gasUsed);
        const gasLimit = BigInt(block.gasLimit);
        const gasUsedPercent = Number((gasUsed * 10000n) / gasLimit) / 100;

        return {
          height: formatHexToDecimal(block.number),
          time: formatTimestamp(block.timestamp),
          timestamp: formatFullTimestamp(block.timestamp),
          proposer: block.miner,
          proposerLabel: block.miner,
          txns: Array.isArray(block.transactions) ? block.transactions.length : 0,
          reward: '-',
          gas: `${formatHexToGwei(block.gasUsed)} Gwei`,
          size: `${formatHexToDecimal(block.size)} bytes`,
          gasUsed: gasUsed.toLocaleString(),
          gasUsedPercent,
          gasLimit: gasLimit.toLocaleString(),
          gasPrice: `${formatHexToMwei(block.baseFeePerGas || '0x0')} Mwei`,
        };
      });
      setBlocks(formattedBlocks);

      // Info: (20260205 - Julian) 5. 從最新的區塊中提取前 10 筆交易
      const latestTransactions = validBlocks.map((block) => block.transactions).flat();

      // Info: (20260205 - Julian) 6. 建立一個區塊號碼對應時間戳的 Map
      const blockTimeMap = new Map(validBlocks.map((b) => [b.number, b.timestamp]));

      // Info: (20260205 - Julian) 7. 整理交易資料並存入狀態
      const formattedTransactions: ITransaction[] = (
        latestTransactions as IJsonRpcTransaction[]
      ).map((tx) => {
        // Info: (20260205 - Julian) 1. 取得時間
        const rawTimestamp = blockTimeMap.get(tx.blockNumber ?? '') || '0x0';
        const timestampInSec = parseInt(rawTimestamp, 16);

        /**
         * Info: (20260205 - Julian) 2. 計算手續費 (估計值：GasPrice * GasLimit)
         * 真正的手續費需要 Receipt 的 gasUsed，首頁通常顯示預算上限或 0
         */
        const gasPrice = BigInt(tx.gasPrice || '0');
        const gasLimit = BigInt(tx.gas || '0');
        const estimatedFee = formatUnits(gasPrice * gasLimit, 'ether');

        // Info: (20260205 - Julian) 3. 處理方法名稱描述 (利用你現有的 getMethodDescription)
        const method = getMethodDescription(tx.input);

        return {
          hash: tx.hash,
          method: method === '0x' ? 'Transfer' : method, // Info: (20260205 - Julian) 如果是 0x 通常是純轉帳,
          blockNumber: formatHexToDecimal(tx.blockNumber ?? '0x0'),

          // Info: (20260205 - Julian) 時間處理
          time: formatTimestamp(rawTimestamp),
          timestamp: timestampInSec.toString(),

          from: tx.from ?? '-',
          to: tx.to ?? 'Contract Creation', // Info: (20260205 - Julian) to 為 null 代表部署合約
          value: formatHexToEther(tx.value),
          // Info: (20260205 - Julian) 手續費與類型
          fee: parseFloat(estimatedFee).toFixed(8),
          type: tx.type === '0x2' ? 'EIP-1559' : 'Legacy',

          // Info: (20260205 - Julian) 額外描述 (例如：From -> To)
          description: `From ${tx.from.slice(0, 6)}... to ${tx.to?.slice(0, 6) || 'New Contract'}`,
        };
      });
      setTransactions(formattedTransactions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (err as string));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!chainId) {
      setError('No chain ID provided');
      return;
    }

    fetchData();

    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, [chainId]);

  return { blocks, transactions, isLoading, error };
}
