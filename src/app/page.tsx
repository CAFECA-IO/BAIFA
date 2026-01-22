import HeroSection from '@/components/home/hero_section';
import ChainList from '@/components/home/chain_list';
import JourneySection from '@/components/home/journey_section';

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
