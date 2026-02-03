'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatTokenAmount } from '@/lib/utils/log_parser';
import CopyButton from '@/components/common/copy_button';

export interface ITokenTransfer {
  from: string;
  to: string;
  value: string;
  tokenAddress: string;
  tokenSymbol?: string; // 可選：需透過額外查詢或對照表取得
  tokenDecimals?: number;
}

enum EViewMode {
  ALL = 'all',
  NET = 'net',
}

interface ITokenTransferListProps {
  transfers: ITokenTransfer[];
  chainId: string;
}

const TokenTransferList = ({ transfers, chainId }: ITokenTransferListProps) => {
  const [viewMode, setViewMode] = useState<EViewMode>(EViewMode.ALL);

  // ToDo: 替換為實際的 token 頁面路徑
  const tokenPath = '#';

  const createAddressLabel = (address: string) => {
    const addressPath = `/chain/${chainId}/address/${address}`;
    return (
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={addressPath}
          className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
        >
          {address}
        </Link>
        <CopyButton value={address} />
      </div>
    );
  };

  const displayedList =
    transfers.length > 0 ? (
      <div className="grow space-y-3">
        {/* 切換按鈕 */}
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode(EViewMode.ALL)}
            className={`rounded px-3 py-1 text-xs ${viewMode === EViewMode.ALL ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
          >
            所有轉帳
          </button>
          <button
            type="button"
            onClick={() => setViewMode(EViewMode.NET)}
            className={`rounded px-3 py-1 text-xs ${viewMode === EViewMode.NET ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
          >
            淨轉帳
          </button>
        </div>

        {/* 轉帳列表 */}
        <ul className="space-y-2">
          {transfers.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">發送方</span>
              {createAddressLabel(item.from)}
              <ArrowRight size={14} className="text-gray-300" />
              <span className="text-gray-400">接收方</span>
              {createAddressLabel(item.to)}
              <span className="ml-2 font-bold">
                {formatTokenAmount(item.value, item.tokenDecimals || 18)}
              </span>
              <Link href={tokenPath}>{item.tokenAddress}</Link>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="grow text-sm text-gray-500">無代幣轉帳</div>
    );

  return (
    <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
      <div className="w-full text-sm text-gray-500 sm:w-1/4">ERC20 代幣轉帳 :</div>
      {displayedList}
    </div>
  );
};

export default TokenTransferList;
