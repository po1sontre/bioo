'use client'

import LandingPage from './components/LandingPage';
import dynamic from 'next/dynamic';

// Import background component with dynamic import (client-side only)
const Background = dynamic(() => import('./components/Background'), { ssr: false });

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Background />
      <LandingPage />
    </main>
  );
}
