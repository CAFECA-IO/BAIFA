import Navbar from '@/components/layout/navbar';
import HeroSection from '@/components/home/hero-section';
import ChainList from '@/components/home/chain-list';
import JourneySection from '@/components/home/journey-section';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="flex w-full items-center flex-col">
        <HeroSection />
        <ChainList />
        <JourneySection />
      </main>
      <Footer />
    </div>
  );
}
