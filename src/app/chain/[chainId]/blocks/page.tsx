'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useBlockchainData } from '@/lib/hooks/use_blockchain_data';
import { useFetchApi } from '@/lib/hooks/use_fetch_api';
import { API_METHOD } from '@/constants/api_method';
import { IChain } from '@/interfaces/chain';
import ChainHeader from '@/components/chain/chain_header';
import BlockTable from '@/components/block/block_table';

export default function BlockListPage() {
  const params = useParams();
  const chainId = params?.chainId as string;

  // 1. Fetch chain info for header
  const { data: chain } = useFetchApi<IChain>({
    url: chainId ? `/api/v1/chains/${chainId}` : null,
    method: API_METHOD.POST,
    errorMessage: '無法下載鏈詳情',
  });

  // 2. Fetch block data
  const { blocks, loading, error } = useBlockchainData(chainId);

  if (loading && blocks.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-20 pt-6 text-black">
        {/* Header Info */}
        <ChainHeader
          chain={chain ?? undefined}
          //  showDetails={showDetails}
          //  onToggleDetails={() => setShowDetails(!showDetails)}
          // latestGasPrice={latestGasPrice}
        />

        <div className="mx-auto max-w-7xl px-6 pt-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">區塊列表</h2>

          <BlockTable />

          {error && <div className="mt-4 text-center text-sm text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
}
