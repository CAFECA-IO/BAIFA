'use client';

import Link from 'next/link';
import { ChevronDown, Globe } from 'lucide-react';
import { useState } from 'react';
import ExplorerMenu from './explorer_menu';

export default function Navbar() {
    const [isExplorerOpen, setIsExplorerOpen] = useState(false);

    return (
        <nav className="relative flex w-full items-center justify-between bg-black px-6 py-4 text-white">
            <div className="flex items-center gap-6">
                <Link href="/" className="text-xl font-bold uppercase tracking-wider">
                    BAIFA
                </Link>
                <div className="h-4 w-[1px] bg-gray-700"></div>
                <div className="relative">
                    <button
                        onClick={() => setIsExplorerOpen(!isExplorerOpen)}
                        className="flex cursor-pointer items-center gap-2 text-sm font-medium hover:text-gray-300 focus:outline-none"
                    >
                        <div className="grid grid-cols-2 gap-[2px]">
                            <div className="h-1 w-1 rounded-full bg-current"></div>
                            <div className="h-1 w-1 rounded-full bg-current"></div>
                            <div className="h-1 w-1 rounded-full bg-current"></div>
                            <div className="h-1 w-1 rounded-full bg-current"></div>
                        </div>
                        <span>瀏覽器</span>
                        <ChevronDown size={16} className={`transition-transform ${isExplorerOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isExplorerOpen && (
                        <div className="absolute top-12 left-0 z-50">
                            <ExplorerMenu />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-gray-400 hover:text-white">
                    <Globe size={18} />
                </button>
            </div>
        </nav>
    );
}
