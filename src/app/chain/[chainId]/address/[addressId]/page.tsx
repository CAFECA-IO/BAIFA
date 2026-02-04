'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  // Copy,
  // AlertTriangle,
  // ChevronDown,
  // Search,
  // ArrowRight,
  // Info,
  // ChevronLeft,
  // ChevronRight,
  // Loader2,
  ArrowLeft,
} from 'lucide-react';
// import { useBlockchainData } from '@/lib/hooks/use_blockchain_data';
// import { truncateAddress } from '@/lib/utils/format';
import ChainHeader from '@/components/chain/chain_header';
import AddressDetailHeader from '@/components/address/address_detail_header';
import AddressTxTable from '@/components/address/address_tx_table';

enum AddressTab {
  TRANSACTIONS = '交易',
}

export const useTransactionList = (address: string, chainId: string) => {
  // ToDo: (20260204 - Julian) Remove any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageKey, setPageKey] = useState<string | null>(null); // 用於分頁

  const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

  const fetchTransactions = async (isNextPage = false) => {
    setLoading(true);
    try {
      // 使用 Alchemy 的 getAssetTransfers API
      const response = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [
            {
              fromBlock: '0x0',
              toBlock: 'latest',
              fromAddress: address, // 或同時查詢 toAddress
              category: ['external', 'erc20', 'erc721'],
              maxCount: '0x19', // 每次 25 筆
              pageKey: isNextPage ? pageKey : undefined,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      const result = data.result;

      if (!result) {
        throw new Error(data.error?.message || 'Unknown Alchemy error');
      }

      setTransactions((prev) => (isNextPage ? [...prev, ...result.transfers] : result.transfers));
      setPageKey(result.pageKey || null);
    } catch (err) {
      console.error('無法取得交易紀錄:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [address, chainId]);

  return { transactions, loading, hasMore: !!pageKey, loadMore: () => fetchTransactions(true) };
};

export default function AddressDetailPage() {
  const params = useParams();
  const chainId = params?.chainId as string;
  const addressId = params?.addressId as string;

  const { transactions /* , loading, hasMore, loadMore */ } = useTransactionList(
    addressId,
    chainId
  );

  // const {
  //   transactions: allTransactions,
  //   latestGasPrice,
  //   loading: chainLoading,
  // } = useBlockchainData(chainId);

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
          <div className="flex pb-4">
            {Object.values(AddressTab).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
                  activeTab === tab
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Info: (20260130 - Julian) Filters Bar */}
          {/* <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400">
                開始日期 <ArrowRight size={14} /> 結束日期
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                發送方/接收方 <ChevronDown size={14} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                數量 <ChevronDown size={14} className="text-gray-400" />
              </div>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="搜索方法"
                  className="rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-[#5841D8]/20 focus:outline-none"
                  aria-label="Filter by Method"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">交易狀態：</span>
                <span className="font-bold text-gray-900">全部</span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
              <Toggle
                isOpen={isOpenSummary}
                onToggle={() => setIsOpenSummary((prev) => !prev)}
                label={{ open: '展示交易統計數據', close: '展示交易統計數據' }}
              />
            </div>
          </div> */}

          {/* Info: (20260204 - Julian) Transaction Table */}
          <AddressTxTable address={addressId} transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
