import { Search } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center sm:py-32">
            {/* Background Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform bg-purple-900/20 blur-[100px] filter"></div>

            <div className="relative z-10 w-full max-w-4xl space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                    全球領先的 Web3 數據分析平臺
                </h1>
                <p className="text-lg text-gray-400 sm:text-xl">
                    區塊鏈瀏覽器、鏈上數據分析及服務
                </p>

                <div className="mx-auto mt-10 w-full max-w-2xl">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="搜索地址 / 交易 / 區塊 / 代幣 / ENS"
                            className="h-14 w-full rounded-full border border-gray-800 bg-white pl-8 pr-16 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            aria-label="Search"
                            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#5841D8] text-white transition hover:bg-[#4b36c0]"
                        >
                            <Search size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
