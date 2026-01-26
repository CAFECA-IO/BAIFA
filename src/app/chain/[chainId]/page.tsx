'use client';

import { useParams } from 'next/navigation';
import BlockList from '@/components/chain/block_list';
import TransactionList from '@/components/chain/transaction_list';
// import ChainOverview from '@/components/chain/chain_overview';
import { IChain } from '@/interfaces/chain';
import { useFetchApi } from '@/lib/hooks/use_fetch_api';
import { Loader2 } from 'lucide-react';
import { API_METHOD } from '@/constants/api_method';

export default function ChainDetailPage() {
  const params = useParams();
  const chainId = params?.chainId as string;
  const {
    data: chain,
    loading,
    error,
  } = useFetchApi<IChain>({
    url: chainId ? `/api/v1/chains/${chainId}` : null,
    method: API_METHOD.POST,
    errorMessage: '無法下載鏈詳情，請稍後再試。',
    body: {
      jsonrpc: '2.0',
      method: 'eth_getTransactionByHash',
      params: ['0x435d8b24ee13fb98f948eaed29d0b714353a3703755d25145e22f420e7dd2fb6'],
      id: 1,
    },
  });

  // console.log("🍉 chain", chain);

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
        {/* <ChainOverview chain={chain} /> */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BlockList />
          <TransactionList />
        </div>
      </div>
    </div>
  );
}
