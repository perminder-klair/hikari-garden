import { useEffect } from 'react';

export function useClickBurst() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target === document.body || target.classList.contains('bg-gradient')) {
        createParticleBurst(e.clientX, e.clientY);
      }
    }

    function createParticleBurst(x: number, y: number) {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: 4px;
          height: 4px;
          background: var(--accent-gold);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
        `;
        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 50 + Math.random() * 50;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        particle.animate(
          [
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 },
          ],
          { duration: 800, easing: 'cubic-bezier(0, .9, .57, 1)' }
        ).onfinish = () => particle.remove();
      }
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
