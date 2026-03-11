import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './QuoteSection.module.css';

export default function QuoteSection() {
  const ref = useIntersectionReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${styles.section} quote-section reveal`}>
      <span className={styles.mark}>"</span>
      <p className={styles.text}>The garden suggests there might be a place where we can meet nature halfway.</p>
      <span className={styles.author}>— Michael Pollan</span>
    </section>
  );
}
