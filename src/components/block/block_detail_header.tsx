'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export enum BlockDetailTabType {
  OVERVIEW = 'overview',
  TRANSACTIONS = 'transactions',
  INTERNAL_TXS = 'internal_txs',
  TOKEN_TRANSFERS = 'token_transfers',
  NFT_TRANSFERS = 'nft_transfers',
  WITHDRAWALS = 'withdrawals',
  BLOB = 'blob',
}

interface IBlockDetailHeaderProps {
  chainId: string;
  blockId: string;
  blockNumber: bigint;
  activeTab: BlockDetailTabType;
}

export default function BlockDetailHeader({
  chainId,
  blockId,
  blockNumber,
  activeTab,
}: IBlockDetailHeaderProps) {
  const prevBlockPath = `/chain/${chainId}/blocks/${blockNumber - 1n}`;
  const nextBlockPath = `/chain/${chainId}/blocks/${blockNumber + 1n}`;

  const tabs: { id: BlockDetailTabType; label: string; path: string }[] = [
    { id: BlockDetailTabType.OVERVIEW, label: '概覽', path: `/chain/${chainId}/blocks/${blockId}` },
    {
      id: BlockDetailTabType.TRANSACTIONS,
      label: '交易',
      path: `/chain/${chainId}/blocks/${blockId}/tx`,
    },
    // ToDo: 其他 Tab 尚未實作，先隱藏
    // { id: BlockDetailTabType.INTERNAL_TXS, label: '內部交易', path: '#' },
    // { id: BlockDetailTabType.TOKEN_TRANSFERS, label: '代幣轉帳', path: '#' },
    // { id: BlockDetailTabType.NFT_TRANSFERS, label: 'NFT 轉帳', path: '#' },
    // { id: BlockDetailTabType.WITHDRAWALS, label: '解押', path: '#' },
    // { id: BlockDetailTabType.BLOB, label: 'Blob', path: '#' },
  ];

  const displayTabs = tabs.map((tab) => (
    <Link
      key={tab.id}
      href={tab.path}
      className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
        tab.id === activeTab
          ? 'bg-black text-white'
          : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {tab.label}
    </Link>
  ));

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">區塊高度</h1>
        <div className="flex items-center gap-2">
          <Link
            href={prevBlockPath}
            className="flex h-6 w-6 items-center justify-center text-gray-600 hover:text-[#5841D8]"
          >
            <ChevronLeft size={16} />
          </Link>
          <span className="font-mono text-sm font-bold text-gray-900">
            {blockNumber.toString()}
          </span>
          <Link
            href={nextBlockPath}
            className="flex h-6 w-6 items-center justify-center text-gray-600 hover:text-[#5841D8]"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">{displayTabs}</div>
    </>
  );
}
