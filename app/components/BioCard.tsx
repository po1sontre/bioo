'use client'

import { useState, useRef, useEffect } from 'react';
import { FaDiscord, FaGithub, FaSpotify, FaYoutube, FaInstagram, FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface BioCardProps {
  username: string;
  profileImage?: string;
  socialLinks: {
    discord: string;
    github: string;
    spotify: string;
    youtube: string;
    instagram: string;
  };
  tracks?: {
    name: string;
    artist: string;
    file: string;
  }[];
}

const BioCard = ({ username, profileImage, socialLinks, tracks }: BioCardProps) => {
  // Card tilt effect state
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);

  // Typewriter effect state
  const [currentBio, setCurrentBio] = useState('');
  const [currentBioIndex, setCurrentBioIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Multiple descriptions to cycle through
  const descriptions = [
    "loser!",
    "Bastard!",
    "no one here can love",
    "music don't always help",
    "end it im crazy",
    "love my soul",
    "he/him",
    "forget you"
  ];

  // Typewriter effect
  useEffect(() => {
    const currentText = descriptions[currentBioIndex];
    
    if (!isDeleting && currentBio === currentText) {
      // Pause at the end of typing
      setTimeout(() => {
        setIsDeleting(true);
        setTypingSpeed(50);
      }, 1500);
    } else if (isDeleting && currentBio === '') {
      // Move to next description after deleting
      setIsDeleting(false);
      setCurrentBioIndex((prev) => (prev + 1) % descriptions.length);
      setTypingSpeed(100);
    } else {
      // Type or delete characters
      const timeout = setTimeout(() => {
        setCurrentBio(isDeleting 
          ? currentText.substring(0, currentBio.length - 1)
          : currentText.substring(0, currentBio.length + 1)
        );
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }
  }, [currentBio, currentBioIndex, isDeleting, typingSpeed]);

  // Update the track information to use your actual MP3 files
  const defaultTracks = [
    {
      name: "wounds",
      artist: "lucille",
      file: "/wounds-lucille.mp3"
    },
    {
      name: "cats in the cold",
      artist: "mage tears",
      file: "/cats in the cold-mage tears.mp3"
    },
    {
      name: "toothache",
      artist: "boccmet",
      file: "/toothache-boccmet.mp3"
    },
    {
      name: "nothing less, nothing more",
      artist: "lucille",
      file: "/nothing less, nothing more - lucille.mp3"
    },
    {
      name: "point blank range",
      artist: "lucille",
      file: "/point blank range - lucille.mp3"
    },
    {
      name: "word vomit",
      artist: "Jades",
      file: "/word vomit - Jades.mp3"
    },
    {
      name: "tell me your regrets",
      artist: "Jades",
      file: "/tell me your regrets - Jades.mp3"
    },
    {
      name: "breakdowns",
      artist: "lucille",
      file: "/breakdowns - lucille.mp3"
    }
  ];

  // Use provided tracks or default tracks
  const trackList = tracks || defaultTracks;

  // Use a state to keep track of the current track
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Start with "wounds" (index 0)
  const currentTrack = trackList[currentTrackIndex];
  
  // Load initial track on component mount
  useEffect(() => {
    const loadAndPlayInitialTrack = async () => {
      if (audioRef.current) {
        try {
          setIsLoading(true);
          audioRef.current.src = currentTrack.file;
          await audioRef.current.load();
          
          // Try to autoplay
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        } catch (error) {
          console.log('Autoplay was prevented:', error);
          // Don't show error toast for autoplay prevention
          setIsPlaying(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAndPlayInitialTrack();
  }, []);

  // Function to safely play audio
  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;

    try {
      setIsLoading(true);
      if (!audio.src) {
        audio.src = currentTrack.file;
        await audio.load();
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
      });
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to safely pause audio
  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;

    audio.pause();
    setIsPlaying(false);
  };

  // Control music player
  const togglePlay = async () => {
    if (isLoading) return;
    
    if (isPlaying) {
      pauseAudio();
    } else {
      await playAudio();
    }
  };

  // Function to go to next track
  const nextTrack = async () => {
    if (isLoading) return;

    const newIndex = (currentTrackIndex + 1) % trackList.length;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
    
    if (audioRef.current) {
      try {
        setIsLoading(true);
        audioRef.current.src = trackList[newIndex].file;
        await audioRef.current.load();
        if (isPlaying) {
          await playAudio();
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Function to go to previous track
  const prevTrack = async () => {
    if (isLoading) return;

    const newIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
    
    if (audioRef.current) {
      try {
        setIsLoading(true);
        audioRef.current.src = trackList[newIndex].file;
        await audioRef.current.load();
        if (isPlaying) {
          await playAudio();
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Set initial volume
    audio.volume = volume;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      nextTrack();
    };
    
    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    
    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);
  
  // Update audio volume when volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = volume;
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Update tilt effect based on mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    
    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
    `;
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="container flex items-center justify-center mx-auto px-4 z-10">
      <div className="card-container">
        <div
          ref={cardRef}
          className="card"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="profile">
            <div className="profile-icon">
              {profileImage ? (
                <Image 
                  src={profileImage} 
                  alt={username} 
                  width={100} 
                  height={100}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-pink-500">♡</span>
              )}
            </div>
            <h1 className="username">{username}</h1>
            <p className="bio">
              <span className="bio-text">{currentBio}</span>
            </p>
            
            <div className="social-links">
              <button 
                className="social-icon discord" 
                onClick={() => {
                  navigator.clipboard.writeText('po1sontre');
                  toast.success('Discord username copied!', {
                    duration: 2000,
                    position: 'bottom-center',
                    style: {
                      background: 'rgba(255, 102, 196, 0.9)',
                      color: '#fff',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(255, 102, 196, 0.3)',
                    },
                  });
                }}
                style={{ '--index': 0 } as React.CSSProperties}
              >
                <FaDiscord />
              </button>
              <a href={socialLinks.github} className="social-icon github" target="_blank" rel="noopener noreferrer" style={{ '--index': 1 } as React.CSSProperties}>
                <FaGithub />
              </a>
              <a href={socialLinks.spotify} className="social-icon spotify" target="_blank" rel="noopener noreferrer" style={{ '--index': 2 } as React.CSSProperties}>
                <FaSpotify />
              </a>
              <a href={socialLinks.youtube} className="social-icon youtube" target="_blank" rel="noopener noreferrer" style={{ '--index': 3 } as React.CSSProperties}>
                <FaYoutube />
              </a>
              <a href={socialLinks.instagram} className="social-icon instagram" target="_blank" rel="noopener noreferrer" style={{ '--index': 4 } as React.CSSProperties}>
                <FaInstagram />
              </a>
            </div>
          </div>
          
          <div className="music-player">
            {/* Hidden audio element for playing the music */}
            <audio ref={audioRef} />
            
            <div className="track-info">
              <div className="track-name">{currentTrack.name}</div>
              <div className="track-artist">{currentTrack.artist}</div>
            </div>
            
            <div className="volume-control">
              <span className="opacity-70 text-xs"><FaVolumeUp /></span>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="slider volume-slider"
                style={{ '--value': `${volume * 100}%` } as React.CSSProperties}
              />
            </div>
            
            <div className="time-control">
              <span className="current-time">{formatTime(currentTime)}</span>
              <div className="progress-bar" onClick={handleProgressClick}>
                <div className="progress" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}></div>
              </div>
              <span className="total-time">{formatTime(duration)}</span>
            </div>
            
            <div className="player-controls">
              <button className="control-btn" onClick={prevTrack}>
                <FaStepBackward />
              </button>
              <button className="control-btn play-pause" onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button className="control-btn" onClick={nextTrack}>
                <FaStepForward />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioCard; 