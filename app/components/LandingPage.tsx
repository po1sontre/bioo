'use client'

import { useRouter } from 'next/navigation';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/main');
  };

  return (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center justify-center cursor-pointer"
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center gap-8">
        <motion.div
          className="flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaStar className="text-pink-500 text-8xl drop-shadow-[0_0_15px_rgba(255,102,196,0.5)]" />
        </motion.div>
        <div className="flex flex-col items-center gap-4">
          <motion.p 
            className="text-white text-2xl font-medium tracking-wider"
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            click me
          </motion.p>
          <motion.p 
            className="text-pink-500/50 text-sm tracking-widest"
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            enter my world
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage; 