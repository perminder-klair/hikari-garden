import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>Crafted with intention · 2026</div>
      <div className={styles.right}>
        <a href="#" className={styles.link}>RSS</a>
        <a href="#" className={styles.link}>GitHub</a>
        <a href="#" className={styles.link}>Contact</a>
      </div>
    </footer>
  );
}
