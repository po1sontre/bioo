'use client'

import { useEffect, useRef } from 'react';

const FloatingElements = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const createHeart = () => {
      const heart = document.createElement('div');
      heart.className = 'floating-element heart';
      
      // Random size between 15px and 30px
      const size = Math.random() * 15 + 15;
      heart.style.width = `${size}px`;
      heart.style.height = `${size}px`;
      
      // Random starting position
      const startX = Math.random() * window.innerWidth;
      heart.style.left = `${startX}px`;
      heart.style.bottom = '-50px';
      
      // Random opacity between 0.4 and 0.8
      heart.style.opacity = `${Math.random() * 0.4 + 0.4}`;
      
      // Create heart shape with SVG
      heart.innerHTML = `
        <svg viewBox="0 0 24 24" fill="rgba(255, 20, 147, ${Math.random() * 0.3 + 0.7})">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      `;
      
      // Random animation duration between 4 and 8 seconds
      const duration = Math.random() * 4000 + 4000;
      
      // Random horizontal movement range
      const moveRange = Math.random() * 100 - 50; // -50px to +50px
      
      // Create keyframes for more complex animation
      const keyframes = [
        {
          transform: `translate(0, 0) rotate(0deg) scale(1)`,
          offset: 0
        },
        {
          transform: `translate(${moveRange * 0.5}px, -${window.innerHeight * 0.3}px) rotate(${Math.random() * 180}deg) scale(${1 + Math.random() * 0.3})`,
          offset: 0.3
        },
        {
          transform: `translate(${-moveRange * 0.3}px, -${window.innerHeight * 0.6}px) rotate(${Math.random() * 360}deg) scale(${1 - Math.random() * 0.2})`,
          offset: 0.6
        },
        {
          transform: `translate(${moveRange}px, -${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg) scale(${1 + Math.random() * 0.2})`,
          offset: 1
        }
      ];

      // Apply animation
      const animation = heart.animate(keyframes, {
        duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });

      // Add glow effect
      heart.style.filter = `drop-shadow(0 0 5px rgba(255, 20, 147, 0.8))
                           drop-shadow(0 0 10px rgba(255, 20, 147, 0.4))`;

      // Remove element when animation ends
      animation.onfinish = () => {
        heart.remove();
      };

      container.appendChild(heart);
    };

    // Create new hearts periodically
    const createHearts = () => {
      // Create 1-3 hearts at a time
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        setTimeout(createHeart, Math.random() * 500); // Stagger creation within 500ms
      }
    };

    // Create hearts every 1-2 seconds
    const interval = setInterval(createHearts, Math.random() * 1000 + 1000);

    // Initial hearts
    for (let i = 0; i < 5; i++) {
      createHeart();
    }

    return () => {
      clearInterval(interval);
      if (container) {
        const hearts = container.getElementsByClassName('floating-element');
        while (hearts.length > 0) {
          hearts[0].remove();
        }
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="floating-elements"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    />
  );
};

export default FloatingElements; 