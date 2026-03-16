import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const pageLinks = [
  { to: '/garden', label: 'Garden' },
  { to: '/thoughts', label: 'Thoughts' },
  { to: '/collection', label: 'Collection' },
  { to: '/wellness', label: 'Wellness' },
  { to: '/system', label: 'System' },
  { to: '/workshop', label: 'Workshop' },
  { to: '/connect', label: 'Connect' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink}>HIKARI</Link>
          <span className={styles.tagline}>Digital Garden · Crafted with intention</span>
        </div>
        <nav className={styles.footerNav}>
          {pageLinks.map(link => (
            <Link key={link.to} to={link.to} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>© 2026 Hikari Garden</div>
        <div className={styles.right}>
          <a href="#" className={styles.link}>RSS</a>
          <a href="#" className={styles.link}>GitHub</a>
          <a href="#" className={styles.link}>Contact</a>
        </div>
      </div>
    </footer>
  );
}
