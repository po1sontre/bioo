'use client'

import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorFollower = cursorFollowerRef.current;
    const glow = glowRef.current;
    const rippleContainer = rippleContainerRef.current;
    
    if (!cursor || !cursorFollower || !glow || !rippleContainer) return;
    
    let lastX = 0;
    let lastY = 0;
    let mouseSpeed = 0;
    
    const updateCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Calculate mouse speed for dynamic effects
      const deltaX = clientX - lastX;
      const deltaY = clientY - lastY;
      mouseSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      lastX = clientX;
      lastY = clientY;
      
      // Update cursor position with slight offset to match cursor.cur
      cursor.style.left = `${clientX - 2}px`;
      cursor.style.top = `${clientY - 2}px`;
      
      // Update follower with slight delay for trailing effect
      setTimeout(() => {
        cursorFollower.style.left = `${clientX - 2}px`;
        cursorFollower.style.top = `${clientY - 2}px`;
      }, 70);
      
      // Update glow position and size based on mouse speed
      glow.style.left = `${clientX}px`;
      glow.style.top = `${clientY}px`;
      
      const glowSize = Math.min(150 + mouseSpeed * 2, 300); // Limit max size
      glow.style.width = `${glowSize}px`;
      glow.style.height = `${glowSize}px`;
      
      // Create ripple effect based on speed and randomness
      const rippleChance = Math.min(0.05 + (mouseSpeed / 100), 0.15); // More ripples with faster movement
      if (e.type === 'mousemove' && Math.random() < rippleChance) {
        createRipple(clientX, clientY, mouseSpeed);
      }
    };
    
    const createRipple = (x: number, y: number, speed: number) => {
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      
      // Random size and duration based on mouse speed
      const sizeVariation = Math.random() * 0.5 + 0.75; // 0.75 to 1.25 multiplier
      const size = (Math.random() * 30 + 20) * sizeVariation;
      const duration = (Math.random() * 1.5 + 1) * (1 + speed / 50);
      
      // Random position offset for more natural water-like effect
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      
      // Random opacity and border width for varied visual effect
      const opacity = Math.random() * 0.5 + 0.3;
      const borderWidth = Math.random() * 2 + 1;
      
      // Apply styles
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x + offsetX}px`;
      ripple.style.top = `${y + offsetY}px`;
      ripple.style.animationDuration = `${duration}s`;
      ripple.style.opacity = `${opacity}`;
      ripple.style.borderWidth = `${borderWidth}px`;
      
      // Random scale factor for non-uniform expansion
      const scaleX = 0.8 + Math.random() * 0.4;
      const scaleY = 0.8 + Math.random() * 0.4;
      ripple.style.setProperty('--scale-x', `${scaleX}`);
      ripple.style.setProperty('--scale-y', `${scaleY}`);
      
      rippleContainer.appendChild(ripple);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        ripple.remove();
      }, duration * 1000);
    };
    
    // Add mouse event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', (e) => {
      cursor.classList.add('clicking');
      cursorFollower.classList.add('clicking');
      
      // Create multiple ripples on click for splash effect
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const randomOffsetX = (Math.random() - 0.5) * 40;
          const randomOffsetY = (Math.random() - 0.5) * 40;
          createRipple(e.clientX + randomOffsetX, e.clientY + randomOffsetY, 30);
        }, i * 50);
      }
    });
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('clicking');
      cursorFollower.classList.remove('clicking');
    });
    
    // Handle mouse entering/leaving links and buttons
    const handleMouseEnter = () => {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    };
    
    const handleMouseLeave = () => {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    };
    
    const links = document.querySelectorAll('a, button, .progress-bar, .slider');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', () => {});
      document.removeEventListener('mouseup', () => {});
      
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);
  
  return (
    <>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-follower" ref={cursorFollowerRef}></div>
      <div className="cursor-glow" ref={glowRef}></div>
      <div className="ripple-container" ref={rippleContainerRef}></div>
    </>
  );
};

export default CustomCursor; 