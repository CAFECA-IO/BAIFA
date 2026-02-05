'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import ChainHeader from '@/components/chain/chain_header';
import AddressDetailHeader from '@/components/address/address_detail_header';
import AddressTxTable from '@/components/address/address_tx_table';
import TokenTransferTable from '@/components/address/token_transfer_table';
import { useTransactionList } from '@/lib/hooks/use_tx_data';
import { TransactionCategory } from '@/constants/transaction_category';

enum AddressTab {
  TRANSACTIONS = '交易',
  TOKEN_TRANSFERS = '代幣轉帳',
}

export default function AddressDetailPage() {
  const params = useParams();
  const chainId = params?.chainId as string;
  const addressId = params?.addressId as string;

  const [activeTab, setActiveTab] = useState<AddressTab>(AddressTab.TRANSACTIONS);

  // Info: (20260205 - Julian) 根據目前 Tab 決定要顯示的交易類別
  const categories: TransactionCategory[] =
    activeTab === AddressTab.TRANSACTIONS
      ? [TransactionCategory.EXTERNAL]
      : [TransactionCategory.ERC20];

  // Info: (20260205 - Julian) 取得交易紀錄
  const { transactions, isLoading } = useTransactionList(addressId, chainId, categories);

  const displayedTabs = Object.values(AddressTab).map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
        activeTab === tab ? 'bg-black text-white' : 'bg-white text-gray-500 hover:text-gray-900'
      }`}
    >
      {tab}
    </button>
  ));

  const displayedContent = isLoading ? (
    <div className="flex items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
        <p className="text-sm text-gray-400">正在載入數據...</p>
      </div>
    </div>
  ) : activeTab === AddressTab.TRANSACTIONS ? (
    <AddressTxTable address={addressId} transactions={transactions} />
  ) : (
    <TokenTransferTable address={addressId} transfers={transactions} />
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
          {/* Info: (20260204 - Julian) Address Identity Section */}
          <AddressDetailHeader address={addressId} chainId={chainId} />

          {/* Info: (20260130 - Julian) Tabs */}
          <div className="flex gap-4 pb-4">{displayedTabs}</div>

          {/* Info: (20260205 - Julian) Content */}
          {displayedContent}
        </div>
      </div>
    </div>
  );
}
