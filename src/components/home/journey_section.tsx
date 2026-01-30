import { ArrowRight, Fuel, PieChart } from 'lucide-react';

export default function JourneySection() {
  return (
    <section className="mx-auto w-full border-b border-gray-200 bg-white px-4 py-16 text-black">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold sm:text-5xl">區塊鏈之旅，從這裡開始</h2>

        {/* Info: (20260130 - Julian) Grid with 1px gap to create borders, no rounded corners */}
        <div className="grid grid-cols-1 grid-rows-4 gap-[1px] border border-gray-200 bg-gray-200 md:grid-cols-2 md:grid-rows-2">
          {/* Info: (20260130 - Julian) Card 1: CEX Asset Dashboard */}
          <div className="flex flex-col justify-between bg-white p-12 transition hover:bg-gray-50">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <PieChart size={28} />
              </div>
              <h3 className="mb-3 text-2xl font-bold">中心化機構資產看板</h3>
              <p className="mb-8 text-base text-gray-500">
                可視化展現主流交易所資產分佈和資金流向，直觀解讀市場變化
              </p>
            </div>
            <button className="flex w-fit items-center gap-2 rounded-full border border-gray-300 px-6 py-2 text-sm font-medium transition hover:border-black hover:bg-black hover:text-white">
              查看詳情 <ArrowRight size={16} />
            </button>
          </div>

          {/* Info: (20260130 - Julian) Card 2: Gas Tracker */}
          <div className="flex flex-col justify-between bg-white p-12 transition hover:bg-gray-50">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <Fuel size={28} />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Gas Tracker</h3>
              <p className="mb-2 text-base text-gray-500">發現最佳交易時刻</p>
              <div className="mb-8">
                <span className="text-sm text-gray-400">ETH 最佳手續費</span>
                <div className="text-3xl font-bold text-orange-600">0.056938 Gwei</div>
              </div>
            </div>
            <button className="flex w-fit items-center gap-2 rounded-full border border-gray-300 px-6 py-2 text-sm font-medium transition hover:border-black hover:bg-black hover:text-white">
              查看詳情 <ArrowRight size={16} />
            </button>
          </div>

          {/* Info: (20260130 - Julian) Card 3: User Feedback */}
          <div className="flex flex-col justify-between bg-white p-12 transition hover:bg-gray-50">
            <div>
              <h3 className="mb-3 text-2xl font-bold">用戶體驗反饋</h3>
              <p className="mb-6 text-base text-gray-500">請與我們直接分享您的建議和想法</p>
            </div>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-gray-400 transition hover:border-black hover:bg-black hover:text-white">
              <ArrowRight size={24} />
            </button>
          </div>

          {/* Info: (20260130 - Julian) Card 4: Bytecode Decompiler */}
          <div className="flex flex-col justify-between bg-white p-12 transition hover:bg-gray-50">
            <div>
              <h3 className="mb-3 text-2xl font-bold">字節碼反編譯</h3>
              <p className="mb-6 text-base text-gray-500">調試未驗證合約，保障鏈上安全</p>
            </div>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-gray-400 transition hover:border-black hover:bg-black hover:text-white">
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
