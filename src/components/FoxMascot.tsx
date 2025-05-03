
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type FoxEmotion = 'happy' | 'excited' | 'thinking' | 'sad' | 'sleeping' | 'neutral';

interface FoxMascotProps {
  emotion?: FoxEmotion;
  message?: string;
  showMessage?: boolean;
  onMessageClose?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FoxMascot = ({
  emotion = 'happy',
  message,
  showMessage = false,
  onMessageClose,
  size = 'md',
  className = '',
}: FoxMascotProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(showMessage);

  useEffect(() => {
    setDisplayMessage(showMessage);
    
    // Auto-hide message after 5 seconds if message is shown
    let timer: ReturnType<typeof setTimeout>;
    if (showMessage) {
      timer = setTimeout(() => {
        setDisplayMessage(false);
        onMessageClose?.();
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showMessage, onMessageClose]);

  // Random animations every 8-15 seconds
  useEffect(() => {
    const randomInterval = Math.floor(Math.random() * 7000) + 8000;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, randomInterval);
    
    return () => clearInterval(interval);
  }, []);

  // Size based on prop
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  // Different fox expressions
  const foxEmotions = {
    happy: "😊",
    excited: "😃",
    thinking: "🤔",
    sad: "😢",
    sleeping: "😴",
    neutral: "😐",
  };

  return (
    <div className={`relative ${className}`}>
      {/* Fox mascot */}
      <motion.div 
        className={`${sizeClasses[size]} rounded-full bg-orange-400 flex items-center justify-center relative overflow-hidden ${isAnimating ? 'animate-wiggle' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isAnimating ? 
          { y: [0, -10, 0], rotate: [0, 5, -5, 0] } : 
          { y: 0, rotate: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        {/* Fox face */}
        <div className="relative w-full h-full">
          {/* Fox body */}
          <div className="absolute inset-0 bg-orange-400 rounded-full"></div>
          
          {/* Fox ears */}
          <div className="absolute -top-3 -left-1 w-6 h-8 bg-orange-500 rounded-full transform rotate-[-30deg]"></div>
          <div className="absolute -top-3 -right-1 w-6 h-8 bg-orange-500 rounded-full transform rotate-[30deg]"></div>
          
          {/* Fox face */}
          <div className="absolute inset-2 bg-orange-200 rounded-full"></div>
          
          {/* Fox eyes */}
          <div className="absolute top-1/3 left-1/4 w-2 h-3 bg-black rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-3 bg-black rounded-full"></div>
          
          {/* Fox nose */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-2 bg-black rounded-full"></div>
          
          {/* Fox emotion */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl">
            {foxEmotions[emotion]}
          </div>
        </div>
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence>
        {displayMessage && message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg min-w-[200px] z-10"
          >
            <div className="relative">
              <p className="text-sm text-gray-700">{message}</p>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoxMascot;
