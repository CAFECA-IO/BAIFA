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
  const [latestGasPrice, setLatestGasPrice] = useState<string>('-');
  const [latestBlockNumber, setLatestBlockNumber] = useState<string>('-');

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
        setLatestBlockNumber(formatHexToDecimal(latestBn));
        const latestBnDec = BigInt(latestBn);

        const fetchedBlocks: IBlock[] = [];
        const fetchedTransactions: ITransaction[] = [];

        let currentBnDec = latestBnDec;
        let blocksProcessed = 0;
        const MAX_BLOCKS_TO_SCAN = 50;

        while (
          (fetchedTransactions.length < 10 || fetchedBlocks.length < 6) &&
          blocksProcessed < MAX_BLOCKS_TO_SCAN &&
          currentBnDec >= 0n
        ) {
          const bnHex = `0x${currentBnDec.toString(16)}`;
          const res = await fetchApi<IJsonRpcResponse<IJsonRpcBlock>>(url, {
            method: 'POST',
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBlockByNumber',
              params: [bnHex, true], // true to get full transactions
              id: blocksProcessed + 2,
            }),
          });

          const b = res.result;
          if (!b) {
            currentBnDec -= 1n;
            blocksProcessed++;
            continue;
          }

          // Extract latest gas price from the first block we successfully fetch
          if (blocksProcessed === 0 || !latestGasPrice || latestGasPrice === '-') {
            setLatestGasPrice(`${formatHexToGwei(b.baseFeePerGas || '0x0')} Gwei`);
          }

          // Add to blocks list if we still need the first 6
          if (fetchedBlocks.length < 6) {
            const gasUsed = BigInt(b.gasUsed);
            const gasLimit = BigInt(b.gasLimit);
            const gasUsedPercent = Number((gasUsed * 10000n) / gasLimit) / 100;

            fetchedBlocks.push({
              height: formatHexToDecimal(b.number),
              time: formatTimestamp(b.timestamp),
              timestamp: formatFullTimestamp(b.timestamp),
              proposer: b.miner,
              proposerLabel: b.miner,
              txns: Array.isArray(b.transactions) ? b.transactions.length : 0,
              reward: '0.00 ETH',
              gas: `${formatHexToGwei(b.gasUsed)} Gwei`,
              size: `${formatHexToDecimal(b.size)} bytes`,
              gasUsed: gasUsed.toLocaleString(),
              gasUsedPercent,
              gasLimit: gasLimit.toLocaleString(),
              gasPrice: `${formatHexToMwei(b.baseFeePerGas || '0x0')} Mwei`,
            });
          }

          // Fetch transactions if we still need more
          const rawTxns = b.transactions;
          if (fetchedTransactions.length < 10 && Array.isArray(rawTxns) && rawTxns.length > 0) {
            let txObjects: IJsonRpcTransaction[] = [];

            if (typeof rawTxns[0] === 'string') {
              // Upstream returned only hashes, need to fetch individually
              // Get the last 10 (latest) transactions in the block
              const totalTx = rawTxns.length;
              const needCount = 10 - fetchedTransactions.length;
              const startIndex = Math.max(0, totalTx - needCount);
              const txHashesToFetch = (rawTxns as string[]).slice(startIndex);

              const txPromises = txHashesToFetch.map((_, index) =>
                fetchApi<IJsonRpcResponse<IJsonRpcTransaction>>(url, {
                  method: 'POST',
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_getTransactionByBlockHashAndIndex',
                    params: [b.hash, `0x${(startIndex + index).toString(16)}`],
                    id: 1000 + blocksProcessed * 100 + index,
                  }),
                })
              );
              const txResponses = await Promise.all(txPromises);
              txObjects = txResponses.map((r) => r.result).filter(Boolean);
            } else {
              // If transactions are already objects, take the last few we need
              const needCount = 10 - fetchedTransactions.length;
              txObjects = (rawTxns as IJsonRpcTransaction[]).slice(-needCount);
            }

            // Reverse to put newest first (highest index first) within this block's contribution
            txObjects
              .slice()
              .reverse()
              .forEach((t: IJsonRpcTransaction) => {
                if (fetchedTransactions.length >= 10) return;

                const gasEstimate = BigInt(t.gas || '0x0');
                const gasPrice = BigInt(t.gasPrice || '0x0');
                const fee = formatHexToEther((gasEstimate * gasPrice).toString(16));

                let method = 'Transfer';
                if (t.input && t.input !== '0x') {
                  method = t.input.slice(0, 10);
                  if (method === '0xa9059cbb') method = 'Transfer (ERC20)';
                  if (method === '0x095ea7b3') method = 'Approve';
                }

                fetchedTransactions.push({
                  hash: t.hash,
                  method,
                  blockNumber: formatHexToDecimal(b.number),
                  time: formatTimestamp(b.timestamp),
                  timestamp: formatFullTimestamp(b.timestamp),
                  from: truncateAddress(t.from),
                  fromLabel: t.from,
                  to: truncateAddress(t.to),
                  toLabel: t.to,
                  value: `${parseFloat(formatHexToEther(t.value)).toFixed(4)} ETH`,
                  fee: `${parseFloat(fee).toFixed(8)} ETH`,
                });
              });
          }

          currentBnDec -= 1n;
          blocksProcessed++;
        }

        setBlocks(fetchedBlocks);
        setTransactions(fetchedTransactions);
        setError(null);
      } catch (err: unknown) {
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

  return { blocks, transactions, latestGasPrice, latestBlockNumber, loading, error };
}
