'use client';

import { useParams } from 'next/navigation';
import BlockList from '@/components/chain/block_list';
import TransactionList from '@/components/chain/transaction_list';
import ChainOverview from '@/components/chain/chain_overview';
// import { IChain } from '@/interfaces/chain';
// import { useFetchApi } from '@/lib/hooks/use_fetch_api';
import { useBlockchainData } from '@/lib/hooks/use_blockchain_data';
// import { Loader2 } from 'lucide-react';
// import { API_METHOD } from '@/constants/api_method';

export default function ChainDetailPage() {
  const params = useParams();
  const chainId = params?.chainId as string;

  // 1. Fetch basic chain info
  // const {
  //   data: chain,
  //   loading: chainLoading,
  //   error: chainError,
  // } = useFetchApi<IChain>({
  //   url: chainId ? `/api/v1/chains/${chainId}` : null,
  //   method: API_METHOD.POST,
  //   errorMessage: '無法下載鏈詳情，請稍後再試。',
  // });

  // 2. Fetch dynamic blockchain data (Blocks & Transactions)
  const {
    blocks,
    transactions,
    latestGasPrice,
    latestBlockNumber,
    loading: dataLoading,
    error: dataError,
  } = useBlockchainData(chainId);

  // if (chainLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-gray-50">
  //       <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  //     </div>
  //   );
  // }

  // if (chainError || !chain) {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-gray-50">
  //       <h1 className="text-2xl font-bold text-black">{chainError || `Chain Not Found: ${chainId}`}</h1>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-20 pt-6 text-black">
        <ChainOverview
          // chain={chain || undefined}
          latestGasPrice={latestGasPrice}
          latestBlockNumber={latestBlockNumber}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BlockList blocks={blocks} loading={dataLoading} />
          <TransactionList transactions={transactions} loading={dataLoading} />
        </div>
        {dataError && (
          <div className="mt-4 text-center text-sm text-red-500">即時數據獲取失敗：{dataError}</div>
        )}
      </div>
    </div>
  );
}
