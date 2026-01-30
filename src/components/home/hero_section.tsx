export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center sm:py-32">
      {/* Info: (20260130 - Julian) Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#5841D8]/50 blur-[120px] filter"></div>

      <div className="relative z-10 w-full max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          全球領先的 Web3 數據分析平臺
        </h1>
        <p className="text-lg text-gray-400 sm:text-xl">區塊鏈瀏覽器、鏈上數據分析及服務</p>
      </div>
    </section>
  );
}
