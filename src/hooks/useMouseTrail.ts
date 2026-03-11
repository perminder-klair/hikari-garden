import { useEffect } from 'react';

export function useMouseTrail() {
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (Math.random() > 0.9) {
        createTrailParticle(e.clientX, e.clientY);
      }
    }

    function createTrailParticle(x: number, y: number) {
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
        z-index: 9998;
        opacity: 0.6;
      `;
      document.body.appendChild(particle);

      particle.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 0.6 },
          { transform: 'translate(0, -20px) scale(0)', opacity: 0 },
        ],
        { duration: 1000, easing: 'ease-out' }
      ).onfinish = () => particle.remove();
    }

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);
}
