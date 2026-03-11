import { useRef, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GardenProvider, useGarden } from './contexts/GardenContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useMouseTrail } from './hooks/useMouseTrail';
import { useClickBurst } from './hooks/useClickBurst';
import { useInterval } from './hooks/useInterval';
import { gardenEvents } from './data/gardenEvents';

import Background from './components/layout/Background';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Hero from './components/sections/Hero';
import StatsBar from './components/sections/StatsBar';
import FeaturesGrid from './components/sections/FeaturesGrid';
import QuoteSection from './components/sections/QuoteSection';
import SeedsTimeline from './components/sections/SeedsTimeline';
import SystemDashboard from './components/sections/SystemDashboard';
import ProjectsShowcase from './components/sections/ProjectsShowcase';
import ThoughtStream from './components/sections/ThoughtStream';
import AgentNetwork from './components/sections/AgentNetwork';
import NowPlaying from './components/sections/NowPlaying';
import ReadingList from './components/sections/ReadingList';
import MoodBoard from './components/sections/MoodBoard';
import GardenLog from './components/sections/GardenLog';
import FocusTimer from './components/sections/FocusTimer';
import HabitTracker from './components/sections/HabitTracker';
import WisdomWell from './components/sections/WisdomWell';
import CodeSnippets from './components/sections/CodeSnippets';
import DailyWord from './components/sections/DailyWord';
import GrowthRings from './components/sections/GrowthRings';
import DreamJournal from './components/sections/DreamJournal';
import RecipeCollection from './components/sections/RecipeCollection';
import TravelLog from './components/sections/TravelLog';
import GratitudeGarden from './components/sections/GratitudeGarden';

import GardenClock from './components/widgets/GardenClock';
import WeatherWidget from './components/widgets/WeatherWidget';
import MoodToggle from './components/widgets/MoodToggle';
import PlantSeedButton from './components/widgets/PlantSeedButton';
import ZenToggle from './components/widgets/ZenToggle';
import AmbientVisualizer from './components/widgets/AmbientVisualizer';
import EasterEgg, { type EasterEggHandle } from './components/widgets/EasterEgg';

function AppInner() {
  const { plantSeed } = useGarden();
  const easterEggRef = useRef<EasterEggHandle>(null);
  const { setKonamiHandler } = useKeyboardShortcuts(plantSeed);

  useMouseTrail();
  useClickBurst();

  useEffect(() => {
    setKonamiHandler(() => easterEggRef.current?.trigger());
  }, [setKonamiHandler]);

  // Console easter egg
  useEffect(() => {
    console.log('%c🌸 Digital Garden', 'font-size: 24px; font-weight: bold; color: #f4d03f;');
    console.log('%cWelcome to the hidden grove.', 'font-size: 14px; color: #a0a0b0;');
    console.log('%cTry the Konami code (↑↑↓↓←→←→BA) for a surprise.', 'font-size: 12px; color: #606070; font-style: italic;');
  }, []);

  // Random garden event notifications
  const triggerRandomEvent = useCallback(() => {
    if (Math.random() > 0.7) {
      const event = gardenEvents[Math.floor(Math.random() * gardenEvents.length)];
      const notif = document.createElement('div');
      notif.textContent = event.message;
      notif.style.cssText = `
        position: fixed; bottom: 100px; right: 2rem;
        background: var(--bg-secondary); border-left: 2px solid var(--accent-gold);
        padding: 1rem 1.5rem; font-size: 0.8rem; color: var(--text-secondary);
        z-index: 100; opacity: 0; transform: translateX(20px); transition: all 0.5s ease;
        font-family: 'Space Mono', monospace;
      `;
      document.body.appendChild(notif);
      setTimeout(() => { notif.style.opacity = '1'; notif.style.transform = 'translateX(0)'; }, 10);
      setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(20px)';
        setTimeout(() => notif.remove(), 500);
      }, 4000);
    }
  }, []);

  useInterval(triggerRandomEvent, 45000);

  return (
    <>
      <Background />

      <GardenClock />
      <WeatherWidget />
      <MoodToggle />
      <PlantSeedButton />
      <ZenToggle />
      <AmbientVisualizer />
      <EasterEgg ref={easterEggRef} />

      <div className="container" style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '7rem 2rem 4rem',
      }}>
        <Header />
        <Hero />
        <StatsBar />
        <FeaturesGrid />
        <QuoteSection />
        <SeedsTimeline />
        <SystemDashboard />
        <ProjectsShowcase />
        <ThoughtStream />
        <AgentNetwork />
        <NowPlaying />
        <ReadingList />
        <MoodBoard />
        <GardenLog />
        <FocusTimer />
        <HabitTracker />
        <WisdomWell />
        <CodeSnippets />
        <DailyWord />
        <DreamJournal />
        <RecipeCollection />
        <TravelLog />
        <GratitudeGarden />
        <GrowthRings />
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <GardenProvider>
        <AppInner />
      </GardenProvider>
    </ThemeProvider>
  );
}
