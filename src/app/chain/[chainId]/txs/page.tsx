'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ChainHeader from '@/components/chain/chain_header';
import TransactionTable from '@/components/transaction/transaction_table';

export default function TransactionListPage() {
  const params = useParams();
  const chainId = params?.chainId as string;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-7xl py-20 pt-6 text-black">
        {/* Info: (20260130 - Julian) Header Info */}
        <div className="flex items-start gap-4">
          <Link
            href={`/chain/${chainId}`}
            className="cursor-pointer text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={32} />
          </Link>
          <ChainHeader />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">交易列表</h2>
          <TransactionTable />
        </div>
      </div>
    </div>
  );
}
