import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const navLinks = [
  { to: '/garden', label: 'Garden' },
  { to: '/thoughts', label: 'Thoughts' },
  { to: '/collection', label: 'Collection' },
  { to: '/wellness', label: 'Wellness' },
  { to: '/system', label: 'System' },
  { to: '/workshop', label: 'Workshop' },
  { to: '/connect', label: 'Connect' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logo}>HIKARI</NavLink>
      <button
        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
