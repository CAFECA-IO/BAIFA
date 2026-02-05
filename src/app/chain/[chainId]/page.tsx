'use client';

import { useParams } from 'next/navigation';
import ChainHeader from '@/components/chain/chain_header';
import BlockList from '@/components/chain/block_list';
import TransactionList from '@/components/chain/transaction_list';
import { useBlockchainData } from '@/lib/hooks/use_blockchain_data';

export default function ChainDetailPage() {
  const params = useParams();
  const chainId = params?.chainId as string;

  // Info: (20260130 - Julian) 2. Fetch dynamic blockchain data (Blocks & Transactions)
  const { blocks, transactions, isLoading, error } = useBlockchainData(chainId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-20 pt-6 text-black">
        <ChainHeader />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BlockList blocks={blocks} isLoading={isLoading} />
          <TransactionList transactions={transactions} isLoading={isLoading} />
        </div>
        {error && (
          <div className="mt-4 text-center text-sm text-red-500">即時數據獲取失敗：{error}</div>
        )}
      </div>
    </div>
  );
}
