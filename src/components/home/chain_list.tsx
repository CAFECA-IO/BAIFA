'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IChain } from '@/interfaces/chain';

const ChainCard = ({ chain }: { chain: IChain }) => {
  return (
    <Link
      key={chain.id}
      href={`/chain/${chain.id}`}
      className="flex flex-col justify-between rounded-xl border border-gray-800 bg-[#111] p-6 transition hover:cursor-pointer hover:bg-slate-800"
    >
      <div className="mb-6 flex items-center gap-4">
        <Image src="/logo/isuncoin.svg" alt="isuncoin_logo" width={24} height={24} />
        <span className="text-xl font-bold text-white">{chain.name}</span>
      </div>

      <div className="space-y-4">
        {chain.stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{stat.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-200">{stat.value}</span>
              {stat.change && (
                <span className={stat.isNegative ? 'text-red-500' : 'text-green-500'}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Link>
  );
};

export default function ChainList() {
  const chains = [
    {
      id: 'isuncoin',
      name: 'iSunCoin',
      icon: 'iSunCoin',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      description:
        'iSunCoin  是一個開放自由的網際網路科技平台，旨在串聯全球電腦的運算資源，為各類去中心化應用程式提供運作環境。',
      stats: [
        { label: 'iSunCoin 價格', value: '$0', change: '0%', isNegative: true },
        { label: '市值', value: '0T' },
        { label: '區塊高度', value: '-' },
        { label: '最佳手續費', value: '0 sat/vB' },
        { label: '24h 鏈上交易量', value: '0K BTC' },
      ],
    },
  ];

  return (
    <section className="mx-[20px] w-full max-w-7xl px-4 py-8 pb-32">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chains.map((chain) => (
          <ChainCard key={chain.id} chain={chain} />
        ))}
      </div>
    </section>
  );
}
