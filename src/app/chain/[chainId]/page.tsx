'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlockList from '@/components/chain/block_list';
import TransactionList from '@/components/chain/transaction_list';
import ChainOverview from '@/components/chain/chain_overview';
import { IChain } from '@/interfaces/chain';
import { fetchApi } from '@/lib/services/api_service';
import { Loader2 } from 'lucide-react';

export default function ChainDetailPage() {
  const params = useParams();
  const chainId = params?.chainId as string;
  const [chain, setChain] = useState<IChain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chainId) return;

    const fetchChainDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchApi<IChain>(`/api/v1/chains/${chainId}`);
        setChain(data);
      } catch (err) {
        console.error('Failed to fetch chain detail:', err);
        setError('無法下載鏈詳情，請稍後再試。');
      } finally {
        setLoading(false);
      }
    };

    fetchChainDetail();
  }, [chainId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !chain) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-black">{error || `Chain Not Found: ${chainId}`}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-20 pt-6 text-black">
        <ChainOverview chain={chain} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BlockList />
          <TransactionList />
        </div>
      </div>
    </div>
  );
}
