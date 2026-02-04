'use client';

// import { useState } from 'react';
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
// import ChainHeader from '@/components/chain/chain_header';
import AddressDetailHeader from '@/components/address/address_detail_header';
// import Toggle from '@/components/common/toggle';
// import CopyButton from '@/components/common/copy_button';

// enum AddressTab {
//   TRANSACTIONS = '交易',
// }

export default function AddressDetailPage() {
  const params = useParams();
  const chainId = params?.chainId as string;
  const addressId = params?.addressId as string;

  // const {
  //   transactions: allTransactions,
  //   latestGasPrice,
  //   loading: chainLoading,
  // } = useBlockchainData(chainId);

  // const [activeTab, setActiveTab] = useState<AddressTab>(AddressTab.TRANSACTIONS);
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
          {/* <ChainHeader
            //  chain={chain}
            //  showDetails={showDetails}
            //  onToggleDetails={() => setShowDetails(!showDetails)}
            latestGasPrice={latestGasPrice}
          /> */}
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-8">
          {/* Info: (20260204 - Julian) Address Identity Section */}
          <AddressDetailHeader address={addressId} chainId={chainId} />

          {/* Info: (20260130 - Julian) Tabs */}
          {/* <div className="mb-6 flex border-b border-gray-200">
            {Object.values(AddressTab).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-4 text-sm font-bold transition-colors ${
                  activeTab === tab ? 'text-[#5841D8]' : 'text-gray-500 hover:text-black'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#5841D8]"></div>
                )}
              </button>
            ))}
          </div> */}

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

          {/* Info: (20260130 - Julian) Transaction Table */}
          {/* <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 bg-white p-4 text-sm text-gray-500">
              <div>
                共計 <span className="font-bold text-gray-900">{transactions.length}</span>{' '}
                條交易記錄 (僅展示最新數據)
              </div>
              <div className="flex items-center gap-4">
                <Toggle
                  isOpen={isShowZeroTransaction}
                  onToggle={() => setIsShowZeroTransaction(!isShowZeroTransaction)}
                  label={{ open: '展示數量為 0 的交易', close: '展示數量為 0 的交易' }}
                  labelOnRight
                />
                <div className="flex items-center gap-4">
                  <button className="text-gray-300">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-bold text-gray-900">1 / 500</span>
                  <button className="text-gray-400">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">交易雜湊</th>
                    <th className="px-6 py-4">方法</th>
                    <th className="px-6 py-4">區塊</th>
                    <th className="px-6 py-4 text-[#5841D8]">時間</th>
                    <th className="px-6 py-4">發送方</th>
                    <th className="px-4 py-4" aria-label="Transaction Direction"></th>
                    <th className="px-6 py-4">接收方</th>
                    <th className="px-6 py-4">數量</th>
                    <th className="px-6 py-4">手續費</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((txn) => {
                    const isOut = txn.fromLabel?.toLowerCase() === addressId.toLowerCase();
                    return (
                      <tr key={txn.hash} className="transition-colors hover:bg-gray-50/50">
                        <td className="px-6 py-5">
                          <Link
                            href={`/chain/${chainId}/txs/${txn.hash}`}
                            className="font-mono text-[#5841D8]"
                          >
                            {truncateAddress(txn.hash, 10, 8)}
                          </Link>
                        </td>
                        <td className="px-6 py-5">
                          <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">
                            {txn.method}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <Link href={`/block/${txn.blockNumber}`} className="text-[#5841D8]">
                            {txn.blockNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                          {txn.timestamp.split(' ')[1]}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/address/${txn.fromLabel}`}
                              className="font-mono text-[#5841D8]"
                            >
                              {txn.from}
                            </Link>
                            <CopyButton size={12} value={txn.fromLabel ?? ''} />
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${isOut ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}
                          >
                            {isOut ? 'Out' : 'In'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/address/${txn.toLabel}`}
                              className="font-mono text-[#5841D8]"
                            >
                              {txn.to}
                            </Link>
                            <CopyButton size={12} value={txn.toLabel ?? ''} />
                          </div>
                        </td>
                        <td
                          className={`px-6 py-5 font-bold ${isOut ? 'text-red-500' : 'text-green-500'}`}
                        >
                          {isOut ? '-' : '+'}
                          {txn.value}
                        </td>
                        <td className="px-6 py-5 text-gray-400">{txn.fee}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
