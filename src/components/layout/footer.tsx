import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Brand */}
        <div className="mb-20">
          <Link href="/" className="mb-4 block text-2xl font-bold tracking-wider uppercase">
            BAIFA
          </Link>
          <p className="text-xs text-gray-500">BAIFA 是多鏈區塊鏈瀏覽器和 Web3 數據平臺</p>
        </div>
      </div>

      {/* Floating Chat Button (Moved from ChainList to be global if needed, but per design it was in ChainList. 
          The screenshot for Footer shows a purple chat button at bottom right. 
          I will add it here fixed or keep it in previous component. 
          Let's add a fixed global one here as per screenshot showing it at bottom right of screen.
      */}
      {/* <button
        aria-label="Open Chat"
        className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#5841D8] text-white shadow-lg transition hover:bg-[#4b36c0]"
      >
        <MessageCircle size={24} />
      </button> */}
    </footer>
  );
}
