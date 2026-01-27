import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/services/api_service';
import { IJsonRpcResponse } from '@/interfaces/rpc';
import { formatHexToEther } from '@/lib/utils/format';

export interface IAddressStats {
  ethBalance: string;
  totalAssets: string;
  assetsChange: string;
  ethValue: string;
  usdtBalance: string;
  usdcBalance: string;
  outgoingTxns: string;
  outgoingEth: string;
  incomingTxns: string;
  incomingEth: string;
  primaryCounterparty: string;
}

export function useAddressData(chainId: string | null, address: string | null) {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<IAddressStats | null>(null);

  useEffect(() => {
    if (!chainId || !address) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `/api/v1/chains/${chainId}`;

        // 1. Get ETH balance
        const balanceRes = await fetchApi<IJsonRpcResponse<string>>(url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [address, 'latest'],
            id: 1,
          }),
        });

        const ethBalance = formatHexToEther(balanceRes.result);
        setBalance(ethBalance);

        // Mocking some stats derived from balance for now,
        // as we don't have a full indexer API yet.
        // In a real scenario, these would come from an indexer.
        setStats({
          ethBalance: `${parseFloat(ethBalance).toFixed(4)} ETH`,
          totalAssets: `$${(parseFloat(ethBalance) * 2000).toLocaleString()}`, // Mocked rate
          assetsChange: '+0.00%',
          ethValue: `$${(parseFloat(ethBalance) * 2000).toLocaleString()}`,
          usdtBalance: '0.00 USDT',
          usdcBalance: '0.00 USDC',
          outgoingTxns: '0',
          outgoingEth: '0 ETH',
          incomingTxns: '0',
          incomingEth: '0 ETH',
          primaryCounterparty: '-',
        });

        setError(null);
      } catch (err: unknown) {
        console.error('Failed to fetch address data:', err);
        setError('無法獲取地址數據');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chainId, address]);

  return { balance, stats, loading, error };
}
