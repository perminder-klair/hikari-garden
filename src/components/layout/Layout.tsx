import { useRef, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGarden } from '../../contexts/GardenContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useMouseTrail } from '../../hooks/useMouseTrail';
import { useClickBurst } from '../../hooks/useClickBurst';
import { useInterval } from '../../hooks/useInterval';
import { gardenEvents } from '../../data/gardenEvents';

import Background from './Background';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

import MoodToggle from '../widgets/MoodToggle';
import PlantSeedButton from '../widgets/PlantSeedButton';
import ZenToggle from '../widgets/ZenToggle';
import AmbientVisualizer from '../widgets/AmbientVisualizer';
import EasterEgg, { type EasterEggHandle } from '../widgets/EasterEgg';

export default function Layout() {
  const { plantSeed } = useGarden();
  const easterEggRef = useRef<EasterEggHandle>(null);
  const { setKonamiHandler } = useKeyboardShortcuts(plantSeed);
  const location = useLocation();

  useMouseTrail();
  useClickBurst();

  useEffect(() => {
    setKonamiHandler(() => easterEggRef.current?.trigger());
  }, [setKonamiHandler]);

  useEffect(() => {
    console.log('%c🌸 Digital Garden', 'font-size: 24px; font-weight: bold; color: #f4d03f;');
    console.log('%cWelcome to the hidden grove.', 'font-size: 14px; color: #a0a0b0;');
    console.log('%cTry the Konami code (↑↑↓↓←→←→BA) for a surprise.', 'font-size: 12px; color: #606070; font-style: italic;');
  }, []);

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
      <ScrollToTop />
      <Background />

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
        padding: '2rem 2rem 4rem',
        overflowX: 'hidden',
      }}>
        <Header />
        <div key={location.pathname} style={{ animation: 'fadeIn 0.3s ease' }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}
