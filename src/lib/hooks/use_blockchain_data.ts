import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/services/api_service';
import { IJsonRpcResponse, IJsonRpcBlock, IJsonRpcTransaction } from '@/interfaces/rpc';
import { IBlock, ITransaction } from '@/interfaces/chain';
import {
  formatHexToDecimal,
  formatTimestamp,
  formatFullTimestamp,
  truncateAddress,
  formatHexToEther,
  formatHexToGwei,
  formatHexToMwei,
} from '@/lib/utils/format';

export function useBlockchainData(chainId: string | null) {
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chainId) return;

    const fetchData = async () => {
      try {
        const url = `/api/v1/chains/${chainId}`;

        // 1. Get latest block number
        const bnRes = await fetchApi<IJsonRpcResponse<string>>(url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
        });

        const latestBn = bnRes.result;
        const latestBnDec = BigInt(latestBn);

        // 2. Fetch last 6 blocks to fill the list
        const blockPromises = [];
        for (let i = 0; i < 6; i++) {
          const bnHex = `0x${(latestBnDec - BigInt(i)).toString(16)}`;
          blockPromises.push(
            fetchApi<IJsonRpcResponse<IJsonRpcBlock>>(url, {
              method: 'POST',
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBlockByNumber',
                params: [bnHex, true], // true to get full transactions
                id: i + 2,
              }),
            })
          );
        }

        const blockResponses: IJsonRpcResponse<IJsonRpcBlock>[] = await Promise.all(blockPromises);
        const fetchedBlocks: IBlock[] = [];
        const fetchedTransactions: ITransaction[] = [];

        blockResponses.forEach((res: IJsonRpcResponse<IJsonRpcBlock>) => {
          const b = res.result;
          if (!b) return;

          const gasUsed = BigInt(b.gasUsed);
          const gasLimit = BigInt(b.gasLimit);
          const gasUsedPercent = Number((gasUsed * 10000n) / gasLimit) / 100;

          fetchedBlocks.push({
            height: formatHexToDecimal(b.number),
            time: formatTimestamp(b.timestamp),
            timestamp: formatFullTimestamp(b.timestamp),
            proposer: truncateAddress(b.miner),
            proposerLabel: b.miner,
            txns: Array.isArray(b.transactions) ? b.transactions.length : 0,
            reward: '0.00 ETH', // Mocked as it's not simple to get via standard RPC
            gas: `${formatHexToGwei(b.gasUsed)} Gwei`,
            size: `${formatHexToDecimal(b.size)} bytes`,
            gasUsed: gasUsed.toLocaleString(),
            gasUsedPercent,
            gasLimit: gasLimit.toLocaleString(),
            gasPrice: `${formatHexToMwei(b.baseFeePerGas || '0x0')} Mwei`,
          });

          if (Array.isArray(b.transactions)) {
            // Take some transactions from each block
            (b.transactions as IJsonRpcTransaction[])
              .slice(0, 3)
              .forEach((t: IJsonRpcTransaction) => {
                fetchedTransactions.push({
                  hash: truncateAddress(t.hash, 10, 8),
                  time: formatTimestamp(b.timestamp),
                  from: truncateAddress(t.from),
                  fromLabel: t.from,
                  to: truncateAddress(t.to),
                  toLabel: t.to,
                  value: `${parseFloat(formatHexToEther(t.value)).toFixed(4)} ETH`,
                });
              });
          }
        });

        setBlocks(fetchedBlocks);
        setTransactions(fetchedTransactions);
        setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Failed to fetch blockchain data:', err);
        setError('無法獲取最新區塊數據');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, [chainId]);

  return { blocks, transactions, loading, error };
}
