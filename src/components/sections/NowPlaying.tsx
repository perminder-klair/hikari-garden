import { useState, useCallback, useEffect, useRef } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { tracks } from '../../data/tracks';
import styles from './NowPlaying.module.css';

export default function NowPlaying() {
  const ref = useIntersectionReveal<HTMLElement>();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const intervalRef = useRef<number | null>(null);

  const track = tracks[currentTrack];

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentTrack(c => (c + 1) % tracks.length);
          return 0;
        }
        return prev + 0.5;
      });
    }, 100);
  }, [stopInterval]);

  useEffect(() => {
    if (isPlaying) startInterval();
    else stopInterval();
    return stopInterval;
  }, [isPlaying, startInterval, stopInterval]);

  const togglePlay = () => setIsPlaying(p => !p);

  const changeTrack = (delta: number) => {
    setCurrentTrack(c => (c + delta + tracks.length) % tracks.length);
    setProgress(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setProgress(((e.clientX - rect.left) / rect.width) * 100);
  };

  return (
    <section ref={ref} className={`${styles.section} now-playing-section reveal`} id="nowPlaying">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Soundtrack</span>
        <h2 className={styles.sectionTitle}>Now Playing</h2>
      </div>
      <div className={styles.player}>
        <div className={`${styles.albumArt} ${isPlaying ? styles.playing : ''}`}>{track.emoji}</div>
        <div className={styles.trackInfo}>
          <div className={styles.trackTitle}>{track.title}</div>
          <div className={styles.trackArtist}>{track.artist}</div>
          <div className={styles.trackMeta}>
            <span>{track.album}</span>
            <span>•</span>
            <span>Punjabi Hip-Hop</span>
          </div>
          <div className={styles.progress} onClick={handleProgressClick}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={() => changeTrack(-1)}>⏮</button>
          <button className={`${styles.controlBtn} ${styles.playBtn}`} onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className={styles.controlBtn} onClick={() => changeTrack(1)}>⏭</button>
        </div>
      </div>
    </section>
  );
}
