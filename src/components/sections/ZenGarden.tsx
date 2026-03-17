import { useState, useEffect, useCallback, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { breathingPatterns } from '../../data/breathing';
import type { BreathingPattern } from '../../types';
import styles from './ZenGarden.module.css';

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdEmpty' | 'idle';

export default function ZenGarden() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [scale, setScale] = useState(1);
  const [sessionBreaths, setSessionBreaths] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const animationRef = useRef<number | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getPhaseDuration = useCallback((p: Phase): number => {
    switch (p) {
      case 'inhale': return selectedPattern.inhale;
      case 'hold': return selectedPattern.hold;
      case 'exhale': return selectedPattern.exhale;
      case 'holdEmpty': return selectedPattern.holdEmpty;
      default: return 0;
    }
  }, [selectedPattern]);

  const getPhaseScale = useCallback((p: Phase): number => {
    switch (p) {
      case 'inhale': return 1.3;
      case 'hold': return 1.3;
      case 'exhale': return 1;
      case 'holdEmpty': return 1;
      default: return 1;
    }
  }, []);

  const getNextPhase = useCallback((current: Phase): Phase => {
    const phases: Phase[] = ['inhale', 'hold', 'exhale', 'holdEmpty'];
    const currentIndex = phases.indexOf(current);
    
    // Skip phases with 0 duration
    let nextIndex = (currentIndex + 1) % phases.length;
    while (getPhaseDuration(phases[nextIndex]) === 0) {
      nextIndex = (nextIndex + 1) % phases.length;
    }
    
    return phases[nextIndex];
  }, [getPhaseDuration]);

  const runPhase = useCallback((currentPhase: Phase) => {
    const duration = getPhaseDuration(currentPhase);
    setPhase(currentPhase);
    setTimeLeft(duration);
    
    // Animate scale
    const targetScale = getPhaseScale(currentPhase);
    const startScale = scale;
    const startTime = Date.now();
    const animateDuration = duration * 1000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animateDuration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const newScale = startScale + (targetScale - startScale) * easeProgress;
      setScale(newScale);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
    
    // Count breaths at the end of exhale
    if (currentPhase === 'exhale') {
      setSessionBreaths(prev => prev + 1);
    }
    
    // Schedule next phase
    phaseTimeoutRef.current = setTimeout(() => {
      const nextPhase = getNextPhase(currentPhase);
      runPhase(nextPhase);
    }, duration * 1000);
  }, [getPhaseDuration, getPhaseScale, getNextPhase, scale]);

  const startBreathing = useCallback(() => {
    setIsActive(true);
    runPhase('inhale');
  }, [runPhase]);

  const stopBreathing = useCallback(() => {
    setIsActive(false);
    setPhase('idle');
    setTimeLeft(0);
    setScale(1);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
    }
  }, []);

  const resetSession = useCallback(() => {
    stopBreathing();
    setSessionBreaths(0);
    setTotalMinutes(0);
  }, [stopBreathing]);

  // Timer countdown
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 0.1));
    }, 100);
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Track total minutes
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTotalMinutes(prev => prev + 1);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
      }
    };
  }, []);

  const getPhaseLabel = (p: Phase): string => {
    switch (p) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'holdEmpty': return 'Pause';
      default: return 'Ready';
    }
  };

  return (
    <section className={styles.zenGarden}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Wind className={styles.icon} size={28} />
          Zen Garden
          <Wind className={styles.icon} size={28} />
        </h2>
        <p className={styles.subtitle}>
          Guided breathing exercises for calm and focus. Find your rhythm.
        </p>
      </header>

      <div className={styles.patternSelector}>
        {breathingPatterns.map((pattern) => (
          <button
            key={pattern.name}
            className={`${styles.patternButton} ${selectedPattern.name === pattern.name ? styles.active : ''}`}
            onClick={() => {
              setSelectedPattern(pattern);
              if (isActive) {
                stopBreathing();
              }
            }}
          >
            {pattern.name}
          </button>
        ))}
      </div>

      <div className={styles.breathingContainer}>
        <div className={styles.circleContainer}>
          <div className={styles.outerRing} />
          <div 
            className={styles.breathingCircle}
            style={{ transform: `scale(${scale})` }}
          >
            <div className={styles.innerGlow} />
            <div className={styles.phaseText}>
              {getPhaseLabel(phase)}
              {isActive && (
                <div className={styles.timer}>
                  {Math.ceil(timeLeft)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          {!isActive ? (
            <button className={`${styles.controlButton} ${styles.startButton}`} onClick={startBreathing}>
              <Play size={18} />
              Start Session
            </button>
          ) : (
            <button className={`${styles.controlButton} ${styles.stopButton}`} onClick={stopBreathing}>
              <Pause size={18} />
              Pause
            </button>
          )}
          <button className={`${styles.controlButton} ${styles.stopButton}`} onClick={resetSession}>
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        <div className={styles.patternInfo}>
          <h3 className={styles.patternName}>{selectedPattern.name}</h3>
          <p className={styles.patternDescription}>{selectedPattern.description}</p>
          <div className={styles.patternTiming}>
            {selectedPattern.inhale > 0 && (
              <div className={styles.timingItem}>
                <div className={styles.timingValue}>{selectedPattern.inhale}s</div>
                <div className={styles.timingLabel}>Inhale</div>
              </div>
            )}
            {selectedPattern.hold > 0 && (
              <div className={styles.timingItem}>
                <div className={styles.timingValue}>{selectedPattern.hold}s</div>
                <div className={styles.timingLabel}>Hold</div>
              </div>
            )}
            {selectedPattern.exhale > 0 && (
              <div className={styles.timingItem}>
                <div className={styles.timingValue}>{selectedPattern.exhale}s</div>
                <div className={styles.timingLabel}>Exhale</div>
              </div>
            )}
            {selectedPattern.holdEmpty > 0 && (
              <div className={styles.timingItem}>
                <div className={styles.timingValue}>{selectedPattern.holdEmpty}s</div>
                <div className={styles.timingLabel}>Pause</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{sessionBreaths}</div>
          <div className={styles.statLabel}>Breaths</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{totalMinutes}</div>
          <div className={styles.statLabel}>Minutes</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{Math.round(sessionBreaths * 0.5)}</div>
          <div className={styles.statLabel}>Calm Points</div>
        </div>
      </div>
    </section>
  );
}
