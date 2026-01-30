'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IChain } from '@/interfaces/chain';
import { ICON_MAP } from '@/lib/maps';
// import useOuterClick from '@/lib/hooks/use_outer_click';
import Toggle from '@/components/common/toggle';

type Props = {
  chain?: IChain;
  showDetails?: boolean;
  onToggleDetails?: () => void;
  latestGasPrice?: string;
};

// const BLOCKCHAIN_MENU = [
//   { label: '交易列表', href: '#' },
//   { label: '大額交易', href: '#' },
//   { label: '待確認交易', href: '#' },
//   { separator: true },
//   { label: '區塊列表 (合併後)', href: '#' },
//   { label: '區塊列表 (合併前)', href: '#' },
//   { label: '驗證者列表', href: '#' },
//   { separator: true },
//   { label: 'Blob 列表', href: '#' },
//   { separator: true },
//   { label: 'ETH 1.0 質押記錄', href: '#' },
//   { label: 'ETH 1.0 解押記錄', href: '#' },
//   { separator: true },
//   { label: '富豪地址', href: '#' },
//   { label: '已驗證合約', href: '#' },
// ];

export default function ChainHeader({
  chain,
  showDetails,
  onToggleDetails,
  // latestGasPrice,
}: Props) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  // const {
  //   targetRef: blockchainRef,
  //   componentVisible: isBlockchainVisible,
  //   setComponentVisible: setBlockchainVisible,
  // } = useOuterClick<HTMLDivElement>(false);

  const displayName = chain ? chain.name : 'iSunCoin';
  // Info: (20260130 - Julian) Resolve Icon
  const color = chain ? chain.color : 'text-gray-800';
  const bgColor = chain ? chain.bgColor : 'bg-gray-100';
  const iconName = chain ? chain.icon : 'iSunCoin';
  const Icon = ICON_MAP[iconName] || null;
  const displayLogo = Icon ? (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor} ${color}`}>
      <Icon size={24} fill="currentColor" className="opacity-80" />
    </div>
  ) : (
    <Image src="/logo/isuncoin.svg" alt="isuncoin_logo" width={24} height={24} />
  );

  const description = chain ? chain.description : 'iSunCoin 是一個開源的去中心化區塊鏈網絡。';

  const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded);

  const shouldTruncate = description.length > 85;
  const displayDescription =
    isDescriptionExpanded || !shouldTruncate ? description : `${description.slice(0, 85)}...`;

  return (
    <div>
      {/* Info: (20260130 - Julian) Top Header Row */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {displayLogo}
          <h1 className="text-2xl font-bold text-gray-900">{displayName} 瀏覽器</h1>
          {/* <div className="flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-xs font-medium text-orange-500">
            <span className="text-[10px]">⛽</span> {latestGasPrice || '-'}
          </div> */}
        </div>

        {/* <div className="flex gap-2 text-sm text-gray-600">
          <div className="relative" ref={blockchainRef}>
            <button
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 transition-colors ${isBlockchainVisible ? 'bg-gray-100 text-black' : 'hover:text-black'}`}
              onClick={() => setBlockchainVisible(!isBlockchainVisible)}
            >
              區塊鏈 {isBlockchainVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isBlockchainVisible && (
              <div className="absolute top-full right-0 z-50 mt-1 w-56 rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
                {BLOCKCHAIN_MENU.map((item, index) =>
                  item.separator ? (
                    <div key={`sep-${index}`} className="my-1 border-t border-gray-100" />
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </div>
            )}
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 hover:text-black">
            代幣 & NFT <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 hover:text-black">
            開發者 <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 hover:text-black">
            更多 <ChevronDown size={14} />
          </button>
        </div> */}
      </div>

      {/* Info: (20260130 - Julian) Description */}
      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        {displayDescription}
        {shouldTruncate && (
          <button
            className="ml-1 cursor-pointer font-bold text-black hover:underline"
            onClick={toggleDescription}
          >
            {isDescriptionExpanded ? '收起全部' : '展開全部'}
          </button>
        )}
      </p>

      {/* Info: (20260130 - Julian) Expand/Collapse Button */}
      <div className="flex items-center justify-between">
        {showDetails && onToggleDetails && (
          <Toggle
            isOpen={showDetails}
            onToggle={onToggleDetails}
            label={{ open: '收起', close: '全部數據' }}
          />
        )}
      </div>
    </div >
  );
}
