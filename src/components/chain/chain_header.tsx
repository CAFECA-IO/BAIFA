'use client';

import { useState } from 'react';
import { Hexagon, Globe, Twitter, MessageCircle, Github, FileText } from 'lucide-react';
import { IChain } from '@/interfaces/chain';
import { ICON_MAP } from '@/lib/maps';

type Props = {
    chain?: IChain;
    showDetails?: boolean;
    onToggleDetails?: () => void;
};

export default function ChainHeader({ chain, showDetails, onToggleDetails }: Props) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const displayName = chain ? chain.name : 'Ethereum';
    // Resolve Icon
    const iconName = chain ? chain.icon : 'Hexagon';
    const Icon = ICON_MAP[iconName] || Hexagon;

    const color = chain ? chain.color : 'text-gray-800';
    const bgColor = chain ? chain.bgColor : 'bg-gray-100';
    const description = chain ? chain.description : 'Ethereum 是一個開源的去中心化區塊鏈網絡...';

    const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded);

    const shouldTruncate = description.length > 85;
    const displayDescription = isDescriptionExpanded || !shouldTruncate
        ? description
        : `${description.slice(0, 85)}...`;

    return (
        <div className="mb-8">
            {/* Top Header Row */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor} ${color}`}>
                        <Icon size={24} fill="currentColor" className="opacity-80" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{displayName} 瀏覽器</h1>
                    <div className="flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-xs font-medium text-orange-500">
                        <span className="text-[10px]">⛽</span> 0.05 Gwei
                    </div>
                </div>

                <div className="flex gap-2 text-sm text-gray-600">
                    <button className="flex items-center gap-1 hover:text-black">
                        區塊鏈 <span className="text-[10px]">▼</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-black">
                        代幣 & NFT <span className="text-[10px]">▼</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-black">
                        開發者 <span className="text-[10px]">▼</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-black">
                        更多 <span className="text-[10px]">▼</span>
                    </button>
                </div>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
                {displayDescription}
                {shouldTruncate && (
                    <span
                        className="cursor-pointer font-bold text-black ml-1 hover:underline"
                        onClick={toggleDescription}
                    >
                        {isDescriptionExpanded ? '收起全部' : '展開全部'}
                    </span>
                )}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black" aria-label="Documentation">
                        <FileText size={16} />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black" aria-label="Twitter">
                        <Twitter size={16} />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black" aria-label="Community">
                        <MessageCircle size={16} />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black" aria-label="Website">
                        <Globe size={16} />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black" aria-label="Github">
                        <Github size={16} />
                    </button>
                    <div className="h-6 w-[1px] bg-gray-300 mx-2"></div>
                    <button className="flex items-center gap-1 rounded border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-gray-400 hover:text-black">
                        OKX Wallet
                    </button>
                </div>

                {chain?.details && (
                    <button
                        type="button"
                        className="flex items-center gap-2 text-xs text-black font-bold cursor-pointer text-nowrap"
                        onClick={onToggleDetails}
                    >
                        <span>{showDetails ? '收起' : '全部數據'}</span>
                        <div className={`relative h-4 w-8 rounded-full transition-colors ${showDetails ? 'bg-black' : 'bg-gray-300'}`}>
                            <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${showDetails ? 'right-0.5' : 'left-0.5'}`}></div>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}
