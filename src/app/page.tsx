import Navbar from '@/components/layout/navbar';
import HeroSection from '@/components/home/hero-section';
import ChainList from '@/components/home/chain-list';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="flex flex-col">
        <HeroSection />
        <ChainList />
      </main>
    </div>
  );
}
