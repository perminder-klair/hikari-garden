import { useState, useEffect, useRef } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { terminalLines, typingCommands } from '../../data/terminalCommands';
import styles from './GardenLog.module.css';

export default function GardenLog() {
  const ref = useIntersectionReveal<HTMLElement>();
  const [currentText, setCurrentText] = useState('');
  const commandIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    let timeout: number;

    function typeCommand() {
      const command = typingCommands[commandIndex.current];

      if (isDeleting.current) {
        charIndex.current--;
        setCurrentText(command.substring(0, charIndex.current));
      } else {
        charIndex.current++;
        setCurrentText(command.substring(0, charIndex.current));
      }

      let typeSpeed = isDeleting.current ? 50 : 100;

      if (!isDeleting.current && charIndex.current === command.length) {
        typeSpeed = 2000;
        isDeleting.current = true;
      } else if (isDeleting.current && charIndex.current === 0) {
        isDeleting.current = false;
        commandIndex.current = (commandIndex.current + 1) % typingCommands.length;
        typeSpeed = 500;
      }

      timeout = window.setTimeout(typeCommand, typeSpeed);
    }

    typeCommand();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section ref={ref} className={`${styles.section} log-section reveal`} id="gardenLog">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>System Activity</span>
        <h2 className={styles.sectionTitle}>Garden Log</h2>
      </div>
      <div className={styles.terminal}>
        <div className={styles.terminalHeader}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
          <span className={styles.terminalTitle}>hikari@ronin:~/garden</span>
        </div>
        <div className={styles.body}>
          {terminalLines.map((line, i) => (
            line.type === 'command' ? (
              <div key={i} className={styles.line}>
                <span className={styles.prompt}>{line.prompt}</span>
                <span className={styles.command}>{line.text}</span>
              </div>
            ) : (
              <div key={i} className={styles.output}>{line.text}</div>
            )
          ))}
          <div className={styles.line}>
            <span className={styles.prompt}>$</span>
            <span className={styles.command}>{currentText}</span>
            <span className={styles.cursor} />
          </div>
        </div>
      </div>
    </section>
  );
}
