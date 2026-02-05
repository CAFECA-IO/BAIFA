'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import ChainHeader from '@/components/chain/chain_header';
import AddressDetailHeader from '@/components/address/address_detail_header';
import AddressTxTable from '@/components/address/address_tx_table';
import { useTransactionList } from '@/lib/hooks/use_tx_data';

enum AddressTab {
  TRANSACTIONS = '交易',
}

export default function AddressDetailPage() {
  const params = useParams();
  const chainId = params?.chainId as string;
  const addressId = params?.addressId as string;

  const { transactions, isLoading } = useTransactionList(addressId, chainId);

  const [activeTab, setActiveTab] = useState<AddressTab>(AddressTab.TRANSACTIONS);

  // const [isOpenSummary, setIsOpenSummary] = useState<boolean>(true);
  // const [isShowZeroTransaction, setIsShowZeroTransaction] = useState<boolean>(false);

  // const loading = chainLoading

  // Info: (20260130 - Julian) Filter and process transactions for this address
  // const transactions = allTransactions
  //   .filter(
  //     (tx) =>
  //       tx.fromLabel?.toLowerCase() === addressId.toLowerCase() ||
  //       tx.toLabel?.toLowerCase() === addressId.toLowerCase()
  //   )
  //   .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

  // if (loading && transactions.length === 0) {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-white">
  //       <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
  //     </div>
  //   );
  // }

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

  const displayedTxTable = isLoading ? (
    <div className="flex items-center justify-center p-6">
      <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
    </div>
  ) : (
    <AddressTxTable address={addressId} transactions={transactions} />
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
          <div className="flex pb-4">{displayedTabs}</div>

          {/* Info: (20260204 - Julian) Transaction Table */}
          {displayedTxTable}
        </div>
      </div>
    </div>
  );
}
