'use client'

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ParticleSystem {
  system: THREE.Points;
  originalPositions: Float32Array;
  scales: Float32Array;
  speeds: Float32Array;
}

const Background = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const targetMouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const mouseActiveRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const isInitializedRef = useRef<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mountKey, setMountKey] = useState(0);

  const resetAnimation = () => {
    console.log("Forcing animation reset");
    setMountKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Only initialize if not already initialized
    if (isInitializedRef.current) {
      return;
    }
    
    console.log("Initializing Three.js background animation", mountKey);
    isInitializedRef.current = true;

    // Create a canvas element we can test for WebGL support
    const testCanvas = document.createElement('canvas');
    let gl;
    
    try {
      // Try to get a WebGL 2 context first
      gl = testCanvas.getContext('webgl2') || 
           testCanvas.getContext('webgl') || 
           testCanvas.getContext('experimental-webgl');
      
      if (!gl) {
        console.error("WebGL not supported. Cannot create background animation.");
        return;
      }
    } catch (e) {
      console.error("Error creating WebGL context:", e);
      return;
    }

    // Performance detection
    const detectPerformance = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const screenSize = window.innerWidth * window.innerHeight;
      
      if (pixelRatio <= 1 || screenSize > 2073600) {
        return 'medium';
      } else if (screenSize > 3686400) {
        return 'low';
      }
      return 'high';
    };
    
    const quality = detectPerformance();
    console.log(`Detected quality level: ${quality}`);

    // Scene setup with error handling
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    
    try {
      // Scene setup
      scene = new THREE.Scene();
      sceneRef.current = scene;
      
      camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
      
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: quality !== 'low',
        powerPreference: 'high-performance',
        canvas: testCanvas
      });
      
      rendererRef.current = renderer;
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'low' ? 1 : 2));
      
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }
      
      camera.position.z = 60;
    } catch (e) {
      console.error("Error setting up Three.js scene:", e);
      return;
    }

    // Particle count based on quality - reduce further for stability
    const particleCounts = quality === 'high' 
      ? { fore: 800, back: 400 } 
      : quality === 'medium' 
      ? { fore: 600, back: 300 } 
      : { fore: 300, back: 150 };

    // Create particle texture
    const createParticleTexture = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      } catch (e) {
        console.error("Error creating particle texture:", e);
        return null;
      }
    };

    // Create particle system
    const createParticleSystem = (
      count: number, 
      size: number, 
      opacity: number, 
      zRange: number,
      colorScheme: 'pink-purple' | 'blue-teal' = 'pink-purple'
    ) => {
      try {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const originalPositions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const speeds = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          
          // Better 3D distribution
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = Math.pow(Math.random(), 0.5) * 100;
          
          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = (Math.random() - 0.5) * zRange;
          
          positions[i3] = x;
          positions[i3 + 1] = y;
          positions[i3 + 2] = z;
          
          originalPositions[i3] = x;
          originalPositions[i3 + 1] = y;
          originalPositions[i3 + 2] = z;
          
          // Color based on scheme
          let hue, saturation, lightness;
          
          if (colorScheme === 'pink-purple') {
            hue = Math.random() * 0.15 + 0.8;
            saturation = 0.7 + Math.random() * 0.3;
            lightness = 0.5 + Math.random() * 0.3;
          } else {
            hue = Math.random() * 0.15 + 0.5;
            saturation = 0.6 + Math.random() * 0.4;
            lightness = 0.4 + Math.random() * 0.4;
          }
          
          const color = new THREE.Color().setHSL(hue, saturation, lightness);
          colors[i3] = color.r;
          colors[i3 + 1] = color.g;
          colors[i3 + 2] = color.b;
          
          scales[i] = 0.5 + Math.random() * 1.5;
          speeds[i] = 0.7 + Math.random() * 0.6;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Create particle texture
        const particleTexture = createParticleTexture();
        
        const material = new THREE.PointsMaterial({
          size: size,
          vertexColors: true,
          transparent: true,
          opacity: opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          map: particleTexture,
          alphaTest: 0.01
        });
        
        return {
          system: new THREE.Points(geometry, material),
          originalPositions,
          scales,
          speeds
        };
      } catch (e) {
        console.error("Error creating particle system:", e);
        return null;
      }
    };
    
    // Create three layers of particles with error handling
    let foregroundParticles: ParticleSystem | null = null;
    let midgroundParticles: ParticleSystem | null = null;
    let backgroundParticles: ParticleSystem | null = null;
    
    try {
      foregroundParticles = createParticleSystem(particleCounts.fore, 1.0, 0.8, 40, 'pink-purple');
      midgroundParticles = createParticleSystem(particleCounts.back, 0.6, 0.6, 70, 'pink-purple');
      backgroundParticles = createParticleSystem(Math.floor(particleCounts.back * 0.7), 0.4, 0.4, 100, 'blue-teal');
      
      if (foregroundParticles) scene.add(foregroundParticles.system);
      if (midgroundParticles) scene.add(midgroundParticles.system);
      if (backgroundParticles) scene.add(backgroundParticles.system);
    } catch (e) {
      console.error("Error adding particle systems to scene:", e);
    }

    // Mouse interaction setup with more reliable event handling
    const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    let idleAnimationTime = 0;
    
    // Improved, more reliable mouse tracking
    const onMouseMove = (event: MouseEvent) => {
      mouseActiveRef.current = true;
      
      // Reset idle timer on mouse movement
      idleAnimationTime = 0;
      
      const newX = (event.clientX - windowHalf.x) / windowHalf.x;
      const newY = -(event.clientY - windowHalf.y) / windowHalf.y;
      
      // Directly update target position
      targetMouseRef.current.x = newX;
      targetMouseRef.current.y = newY;
    };

    // Touch support
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouseActiveRef.current = true;
        
        // Reset idle timer on touch
        idleAnimationTime = 0;
        
        const newX = (event.touches[0].clientX - windowHalf.x) / windowHalf.x;
        const newY = -(event.touches[0].clientY - windowHalf.y) / windowHalf.y;
        
        targetMouseRef.current.x = newX;
        targetMouseRef.current.y = newY;
      }
    };

    // Handle mouse/touch events more reliably
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    
    // Reset mouse activity when cursor leaves window
    const onMouseLeave = () => {
      mouseActiveRef.current = false;
    };
    
    window.addEventListener('mouseleave', onMouseLeave);
    
    // Animation loop with improved reliability
    const clock = new THREE.Clock();
    clock.start();
    
    // Update particles function
    const updateParticles = (
      particles: ParticleSystem | null,
      depthInfluence: number,
      waveScale: number,
      rotationSpeed: number
    ) => {
      if (!particles || !particles.system || !particles.system.geometry) return;

      const positions = (particles.system.geometry as THREE.BufferGeometry)
                       .attributes.position.array as Float32Array;
      
      const timeValue = performance.now() * 0.001;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        const originalX = particles.originalPositions[i3];
        const originalY = particles.originalPositions[i3 + 1];
        const originalZ = particles.originalPositions[i3 + 2];
        
        const distance = Math.sqrt(
          originalX * originalX + 
          originalY * originalY + 
          originalZ * originalZ
        );
        
        const depthFactor = Math.min((distance / 50) * depthInfluence, 2);
        const individualSpeed = particles.speeds[i];
        const timeFactor = timeValue * individualSpeed;
        
        const angle = timeValue * rotationSpeed;
        const rotatedX = originalX * Math.cos(angle) - originalY * Math.sin(angle);
        const rotatedY = originalX * Math.sin(angle) + originalY * Math.cos(angle);
        
        positions[i3] = rotatedX + (-mouseRef.current.x * 20 * depthFactor) + 
                    Math.sin(timeFactor + distance * 0.05) * waveScale;
        positions[i3 + 1] = rotatedY + (mouseRef.current.y * 20 * depthFactor) + 
                        Math.cos(timeFactor + distance * 0.05) * waveScale;
        positions[i3 + 2] = originalZ + 
                        Math.sin(timeFactor * 2 + distance * 0.1) * waveScale * 0.5;
      }
      
      particles.system.geometry.attributes.position.needsUpdate = true;
    };

    const animate = (time: number) => {
      if (!isVisibleRef.current) {
        animationRef.current = null;
        return;
      }

      const delta = clock.getDelta();
      
      // Idle animation when no mouse activity
      idleAnimationTime += delta;
      if (!mouseActiveRef.current || idleAnimationTime > 3) {
        targetMouseRef.current.x = Math.sin(time * 0.0005) * 0.3;
        targetMouseRef.current.y = Math.cos(time * 0.0004) * 0.2;
      }
      
      // Smoothly interpolate actual mouse position
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * Math.min(delta * 8, 0.2);
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * Math.min(delta * 8, 0.2);

      // Update particles
      updateParticles(foregroundParticles, 1.5, 2.5, 0.02);
      updateParticles(midgroundParticles, 1.0, 1.8, 0.01);
      updateParticles(backgroundParticles, 0.5, 1.0, 0.005);

      // Camera movement
      const cameraTargetX = -mouseRef.current.x * 15;
      const cameraTargetY = mouseRef.current.y * 15;
      
      camera.position.x += (cameraTargetX - camera.position.x) * Math.min(delta * 3, 0.1);
      camera.position.y += (cameraTargetY - camera.position.y) * Math.min(delta * 3, 0.1);
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      
      if (!isLoaded) {
        setIsLoaded(true);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate(0);

    // Cleanup function
    return () => {
      console.log("Cleaning up Three.js resources");
      
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Properly dispose Three.js resources
      try {
        if (foregroundParticles && foregroundParticles.system) {
          if (scene) scene.remove(foregroundParticles.system);
          foregroundParticles.system.geometry.dispose();
          (foregroundParticles.system.material as THREE.Material).dispose();
        }
        
        if (midgroundParticles && midgroundParticles.system) {
          if (scene) scene.remove(midgroundParticles.system);
          midgroundParticles.system.geometry.dispose();
          (midgroundParticles.system.material as THREE.Material).dispose();
        }
        
        if (backgroundParticles && backgroundParticles.system) {
          if (scene) scene.remove(backgroundParticles.system);
          backgroundParticles.system.geometry.dispose();
          (backgroundParticles.system.material as THREE.Material).dispose();
        }
        
        if (renderer) {
          renderer.dispose();
          const domElement = renderer.domElement;
          if (containerRef.current?.contains(domElement)) {
            containerRef.current.removeChild(domElement);
          }
        }
      } catch (e) {
        console.error("Error during cleanup:", e);
      }
      
      // Clear refs
      sceneRef.current = null;
      rendererRef.current = null;
      isInitializedRef.current = false;
    };
  }, [mountKey, isLoaded]);

  // Add a manual reset button that we'll hide in the corner
  return (
    <>
      <div 
        ref={containerRef} 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in',
          background: 'radial-gradient(circle at center, #1a0a1f 0%, #050008 60%, #000000 100%)'
        }}
      />
      <button
        onClick={resetAnimation}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          opacity: 0.3,
          fontSize: '10px',
          padding: '2px 5px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        Reset Animation
      </button>
    </>
  );
};

export default Background;