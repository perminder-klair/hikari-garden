const connectLinks = [
  { label: 'RSS', href: '#', description: 'Subscribe to updates from the garden' },
  { label: 'GitHub', href: '#', description: 'View the source code and open-source projects' },
  { label: 'Contact', href: '#', description: 'Reach out for collaboration or just to say hello' },
];

export default function ConnectPage() {
  return (
    <section style={{ minHeight: '50vh', paddingTop: '2rem' }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '2rem',
        fontWeight: 300,
        color: 'var(--text-primary)',
        marginBottom: '1rem',
      }}>
        Connect
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        lineHeight: 1.8,
        marginBottom: '3rem',
        maxWidth: '600px',
      }}>
        Every garden thrives with connection. Find me through any of these paths.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {connectLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            style={{
              display: 'block',
              padding: '1.5rem 2rem',
              background: 'var(--bg-secondary)',
              borderLeft: '2px solid var(--accent-gold)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'var(--accent-gold)',
              marginBottom: '0.5rem',
            }}>
              {link.label}
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}>
              {link.description}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
