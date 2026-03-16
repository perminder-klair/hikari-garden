import Hero from '../components/sections/Hero';
import StatsBar from '../components/sections/StatsBar';
import FeaturesGrid from '../components/sections/FeaturesGrid';
import QuoteSection from '../components/sections/QuoteSection';
import GrowthRings from '../components/sections/GrowthRings';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturesGrid />
      <QuoteSection />
      <GrowthRings />
    </>
  );
}
