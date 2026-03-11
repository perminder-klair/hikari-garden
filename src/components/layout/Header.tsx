import styles from './Header.module.css';

const navLinks = [
  { href: '#garden', label: 'Garden' },
  { href: '#thoughts', label: 'Thoughts' },
  { href: '#collection', label: 'Collection' },
  { href: '#connect', label: 'Connect' },
];

export default function Header() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header>
      <div className={styles.logo}>HIKARI</div>
      <nav className={styles.nav}>
        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={styles.navLink}
            onClick={(e) => handleClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
