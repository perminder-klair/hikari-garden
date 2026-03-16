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
  return (
    <header>
      <NavLink to="/" className={styles.logo}>HIKARI</NavLink>
      <nav className={styles.nav}>
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
