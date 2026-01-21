import Link from 'next/link';
import { ChevronDown, Globe } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="flex w-full items-center justify-between bg-black px-6 py-4 text-white">
            <div className="flex items-center gap-6">
                <Link href="/" className="text-xl font-bold uppercase tracking-wider">
                    OKLINK
                </Link>
                <div className="h-4 w-[1px] bg-gray-700"></div>
                <div className="flex cursor-pointer items-center gap-2 text-sm font-medium hover:text-gray-300">
                    <div className="grid grid-cols-2 gap-[2px]">
                        <div className="h-1 w-1 rounded-full bg-current"></div>
                        <div className="h-1 w-1 rounded-full bg-current"></div>
                        <div className="h-1 w-1 rounded-full bg-current"></div>
                        <div className="h-1 w-1 rounded-full bg-current"></div>
                    </div>
                    <span>瀏覽器</span>
                    <ChevronDown size={16} />
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
