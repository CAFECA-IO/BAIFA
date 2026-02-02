'use client';

import Link from 'next/link';
import { useState, use } from 'react';
import TransactionOverview from '@/components/transaction/transaction_overview';
import TransactionStatus from '@/components/transaction/transaction_status';
import { ArrowLeft } from 'lucide-react';

interface ITransactionDetailsPageProps {
  params: Promise<{
    chainId: string;
    transactionId: string; // Info: (20260130 - Julian) This is the hash
  }>;
}

enum TxTab {
  OVERVIEW = 'overview',
  STATUS = 'status',
}

export default function TransactionDetailsPage(props: ITransactionDetailsPageProps) {
  const params = use(props.params);
  const { chainId, transactionId } = params;

  const txListPath = `/chain/${chainId}/txs`;

  const [activeTab, setActiveTab] = useState<TxTab>(TxTab.OVERVIEW);

  const displayedBtns = Object.values(TxTab).map((tab) => {
    const tabName = tab === TxTab.OVERVIEW ? '概覽' : '狀態';
    const clickHandler = () => setActiveTab(tab);
    return (
      <button
        key={tab}
        type="button"
        onClick={clickHandler}
        className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
          activeTab === tab ? 'bg-black text-white' : 'bg-white text-gray-500 hover:text-gray-900'
        }`}
      >
        {tabName}
      </button>
    );
  });

  const displayedContent =
    activeTab === TxTab.OVERVIEW ? (
      <TransactionOverview chainId={chainId} txId={transactionId} />
    ) : (
      <TransactionStatus chainId={chainId} txId={transactionId} />
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Info: (20260202 - Julian) Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href={txListPath} className="cursor-pointer text-gray-500 hover:text-gray-800">
            <ArrowLeft size={32} />
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">交易詳情</h1>
        </div>

        {/* Info: (20260130 - Julian) Tabs */}
        <div className="mb-6 flex gap-4">{displayedBtns}</div>

        {displayedContent}
      </div>
    </div>
  );
}
