import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const browsers1 = ['Bitcoin', 'Ethereum', 'X Layer', 'Solana', 'TRON', 'BNB Chain', 'Base', 'Sui', 'Aptos', 'Arbitrum One', 'OP Mainnet'];
const browsers2 = ['Polygon', 'Avalanche-C', 'Polygon zkEVM', 'zkSync Era', 'TON', 'Gravity Alpha Mainnet', 'Bitlayer Mainnet', 'Linea', 'BOB Mainnet', 'B² Mainnet', 'Duckchain Mainnet'];
const browsers3 = ['ApeChain Mainnet', 'Manta Pacific', 'opBNB Mainnet', 'Scroll', 'Fantom', 'Cosmos Hub', 'Kava', 'Kaia Network', 'Ronin', 'Gnosis', 'OKT Chain'];
const browsers4 = ['Ethereum Classic', 'EthereumPoW', 'Beacon Chain', 'Dogecoin', 'Litecoin', 'Bitcoin Cash', 'DASH', 'X Layer Testnet', 'Sepolia Testnet'];

export default function Footer() {
    return (
        <footer className="w-full bg-black px-6 py-16 text-white pb-32">
            <div className="mx-auto max-w-7xl">
                {/* Top: Subscription */}
                <div className="mb-20 flex flex-col items-center justify-center text-center">
                    <h2 className="mb-8 text-2xl font-bold">訂閱獲取最新鏈上資訊</h2>
                    <div className="relative w-full max-w-md">
                        <input
                            type="email"
                            aria-label="Email subscription"
                            placeholder="輸入郵箱"
                            className="h-12 w-full rounded-full bg-white px-6 text-black outline-none placeholder:text-gray-400"
                        />
                        <button className="absolute right-1 top-1 h-10 rounded-full bg-[#5841D8] px-6 text-sm font-bold text-white transition hover:bg-[#4b36c0]">
                            訂閱
                        </button>
                    </div>
                </div>

                {/* Brand */}
                <div className="mb-20">
                    <Link href="/" className="mb-4 block text-2xl font-bold uppercase tracking-wider">
                        BAIFA
                    </Link>
                    <p className="text-xs text-gray-500">
                        BAIFA 是多鏈區塊鏈瀏覽器和 Web3 數據平臺
                    </p>
                </div>

                {/* Middle: Links */}
                <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-9">
                    {/* Browser Links (4 Columns) */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
                        <div>
                            <h3 className="mb-6 font-bold text-gray-300">瀏覽器</h3>
                            <ul className="space-y-3 text-xs text-gray-500">
                                {browsers1.map(item => <li key={item}><Link href="/" className="hover:text-white transition">{item}</Link></li>)}
                            </ul>
                        </div>
                        <div className="pt-[44px]"> {/* Spacer to align with first column list */}
                            <ul className="space-y-3 text-xs text-gray-500">
                                {browsers2.map(item => <li key={item}><Link href="/" className="hover:text-white transition">{item}</Link></li>)}
                            </ul>
                        </div>
                        <div className="pt-[44px]">
                            <ul className="space-y-3 text-xs text-gray-500">
                                {browsers3.map(item => <li key={item}><Link href="/" className="hover:text-white transition">{item}</Link></li>)}
                            </ul>
                        </div>
                        <div className="pt-[44px]">
                            <ul className="space-y-3 text-xs text-gray-500">
                                {browsers4.map(item => <li key={item}><Link href="/" className="hover:text-white transition">{item}</Link></li>)}
                            </ul>
                        </div>
                    </div>

                    {/* About Links */}
                    <div className="lg:col-span-1">
                        <h3 className="mb-6 font-bold text-gray-300">關於 BAIFA</h3>
                        <ul className="space-y-3 text-xs text-gray-500">
                            <li><Link href="/" className="hover:text-white transition">用戶條款</Link></li>
                            <li><Link href="/" className="hover:text-white transition">隱私條款</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom: Partners */}
                <div className="border-t border-gray-900 pt-8 text-gray-600">
                    <h4 className="mb-3 font-bold text-gray-300">合作伙伴鏈接</h4>
                    <div className="space-y-2 text-xs">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-gray-300">OKX 官網:</span>
                            <Link href="/" className="hover:text-gray-400">OKX.com</Link>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-gray-300">OKX Web3:</span>
                            <Link href="/" className="hover:text-gray-400">OKX.com/Web3</Link>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-gray-300">OKX 錢包:</span>
                            <Link href="/" className="hover:text-gray-400">OKX 錢包</Link>
                            <Link href="/" className="hover:text-gray-400">BTC 錢包</Link>
                            <Link href="/" className="hover:text-gray-400">ETH 錢包</Link>
                            <Link href="/" className="hover:text-gray-400">SOL 錢包</Link>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-gray-300">OKX 幣價:</span>
                            <Link href="/" className="hover:text-gray-400">比特幣 (BTC) 幣價</Link>
                            <Link href="/" className="hover:text-gray-400">以太坊 (ETH) 幣價</Link>
                            <Link href="/" className="hover:text-gray-400">Cardano 幣價</Link>
                            <Link href="/" className="hover:text-gray-400">Solana 幣價</Link>
                            <Link href="/" className="hover:text-gray-400">XRP 幣價</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat Button (Moved from ChainList to be global if needed, but per design it was in ChainList. 
          The screenshot for Footer shows a purple chat button at bottom right. 
          I will add it here fixed or keep it in previous component. 
          Let's add a fixed global one here as per screenshot showing it at bottom right of screen.
      */}
            <button
                aria-label="Open Chat"
                className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#5841D8] text-white shadow-lg transition hover:bg-[#4b36c0] z-50"
            >
                <MessageCircle size={24} />
            </button>

        </footer>
    );
}
