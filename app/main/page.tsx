'use client'

import BioCard from '../components/BioCard';
import FloatingElements from '../components/FloatingElements';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

// Import custom cursor and background components with dynamic import (client-side only)
const CustomCursor = dynamic(() => import('../components/CustomCursor'), { ssr: false });
const Background = dynamic(() => import('../components/Background'), { ssr: false });

export default function MainPage() {
  // You can customize these props based on user input
  const userProfile = {
    username: "po1sontre",
    profileImage: "/pfp2.jpg",
    socialLinks: {
      discord: "https://discord.com/users/287608141191970817",
      github: "https://github.com/po1sontre",
      spotify: "https://open.spotify.com/user/31bb64trrbwinip6q743jyi32tmu",
      youtube: "https://www.youtube.com/@po1sontre",
      instagram: "https://instagram.com/po1sontre"
    },
    tracks: [
      { name: "wounds", artist: "lucille", file: "/wounds-lucille.mp3" },
      { name: "point blank range", artist: "lucille", file: "/point blank range - lucille.mp3" },
      { name: "breakdowns", artist: "lucille", file: "/breakdowns - lucille.mp3" },
      { name: "nothing less, nothing more", artist: "lucille", file: "/nothing less, nothing more - lucille.mp3" },
      { name: "word vomit", artist: "Jades", file: "/word vomit - Jades.mp3" },
      { name: "tell me your regrets", artist: "Jades", file: "/tell me your regrets - Jades.mp3" },
      { name: "cats in the cold", artist: "mage tears", file: "/cats in the cold-mage tears.mp3" },
      { name: "toothache", artist: "boccmet", file: "/toothache-boccmet.mp3" }
    ]
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Background />
      <CustomCursor />
      <FloatingElements />
      <BioCard 
        username={userProfile.username}
        profileImage={userProfile.profileImage}
        socialLinks={userProfile.socialLinks}
        tracks={userProfile.tracks}
      />
      <Toaster />
    </main>
  );
} 