'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useFetchApi } from '@/lib/hooks/use_fetch_api';
import { API_METHOD } from '@/constants/api_method';
import { IChain } from '@/interfaces/chain';
import ChainHeader from '@/components/chain/chain_header';
import BlockTable from '@/components/block/block_table';

export default function BlockListPage() {
  const params = useParams();
  const chainId = params?.chainId as string;

  // Fetch chain info for header
  const { data: chain } = useFetchApi<IChain>({
    url: chainId ? `/api/v1/chains/${chainId}` : null,
    method: API_METHOD.POST,
    errorMessage: '無法下載鏈詳情',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-20 pt-6 text-black">
        {/* Header Info */}
        <div className="flex items-start gap-4">
          <Link
            href={`/chain/${chainId}`}
            className="cursor-pointer text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={32} />
          </Link>
          <ChainHeader
            chain={chain ?? undefined}
            //  showDetails={showDetails}
            //  onToggleDetails={() => setShowDetails(!showDetails)}
            // latestGasPrice={latestGasPrice}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">區塊列表</h2>
          <BlockTable />
        </div>
      </div>
    </div>
  );
}
