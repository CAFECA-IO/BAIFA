import HeroSection from '@/components/home/hero-section';
import ChainList from '@/components/home/chain-list';
import JourneySection from '@/components/home/journey-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <main className="flex w-full items-center flex-col">
        <HeroSection />
        <ChainList />
        <JourneySection />
      </main>
    </div>
  );
}
