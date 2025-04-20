'use client'

import BioCard from './components/BioCard';
import FloatingElements from './components/FloatingElements';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

// Import custom cursor and background components with dynamic import (client-side only)
const CustomCursor = dynamic(() => import('./components/CustomCursor'), { ssr: false });
const Background = dynamic(() => import('./components/Background'), { ssr: false });

export default function Home() {
  // You can customize these props based on user input
  const userProfile = {
    username: "po1sontre",
    bio: "blayt!",
    profileImage: "/pfp2.jpg",
    socialLinks: {
      discord: "https://discord.com/users/287608141191970817",
      github: "https://github.com/po1sontre",
      spotify: "https://open.spotify.com/user/31bb64trrbwinip6q743jyi32tmu",
      youtube: "https://www.youtube.com/@po1sontre",
      instagram: "https://instagram.com/po1sontre"
    },
    tracks: [
      { name: "cats in the cold", artist: "mage tears", file: "/cats in the cold-mage tears.mp3" },
      { name: "toothache", artist: "boccmet", file: "/toothache-boccmet.mp3" },
      { name: "wounds", artist: "lucille", file: "/wounds-lucille.mp3" },
    ]
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Background />
      <CustomCursor />
      <FloatingElements />
      <BioCard 
        username={userProfile.username}
        bio={userProfile.bio}
        profileImage={userProfile.profileImage}
        socialLinks={userProfile.socialLinks}
        tracks={userProfile.tracks}
      />
      <Toaster />
    </main>
  );
}
