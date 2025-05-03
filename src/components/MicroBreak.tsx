
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface MicroBreakProps {
  streak: number;
  onComplete: () => void;
}

const MicroBreak = ({ streak, onComplete }: MicroBreakProps) => {
  const { toast } = useToast();
  const [secondsLeft, setSecondsLeft] = useState(15);
  
  useEffect(() => {
    if (streak > 0 && streak % 5 === 0) {
      toast({
        title: "Impressive Streak!",
        description: `You've maintained a streak of ${streak} correct answers. ¡Muy bien!`,
        duration: 3000
      });
    }
    
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (secondsLeft === 0) {
      onComplete();
    }
  }, [secondsLeft, onComplete]);

  const motivationalPhrases = [
    "¡Excelente trabajo! Take a short break.",
    "Your brain deserves a rest. ¡Buen trabajo!",
    "Great progress! Breathe and get ready for more.",
    "Learning Spanish takes time. You're doing great!",
    "Every card you learn brings you closer to fluency!"
  ];
  
  const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md"
    >
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="mb-6 text-yellow-500"
      >
        <Trophy size={48} />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-center mb-2">¡Tiempo de descanso!</h2>
      <p className="text-gray-600 text-center mb-6">
        {randomPhrase}
      </p>
      
      {streak > 0 && (
        <div className="flex items-center mb-6 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg">
          <Award className="mr-2" />
          <span className="font-medium">Current streak: {streak}</span>
        </div>
      )}
      
      <div className="w-full max-w-xs bg-gray-100 h-2 rounded-full mb-4">
        <div 
          className="bg-spanish-red h-2 rounded-full transition-all duration-1000" 
          style={{ width: `${(secondsLeft / 15) * 100}%` }}
        ></div>
      </div>
      
      <Button onClick={onComplete} className="bg-spanish-red hover:bg-spanish-darkred">
        Continue Learning ({secondsLeft}s)
      </Button>
    </motion.div>
  );
};

export default MicroBreak;
