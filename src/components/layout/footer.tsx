import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Brand */}
        <div className="mb-20">
          <Link href="/" className="mb-4 block text-2xl font-bold tracking-wider uppercase">
            BAIFA
          </Link>
          <p className="text-xs text-gray-500">BAIFA 是多鏈區塊鏈瀏覽器和 Web3 數據平臺</p>
        </div>
      </div>
    </footer>
  );
}
