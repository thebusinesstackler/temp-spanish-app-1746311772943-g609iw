
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle } from 'lucide-react';
import { playSoundEffect } from '@/services/textToSpeech';
import SpeechControls from './SpeechControls';

interface WordBuildingExerciseProps {
  question: string;
  correctAnswer: string;
  availableWords: string[];
  imageUrl?: string;
  onCorrect: () => void;
  onIncorrect: () => void;
  hint?: string;
}

const WordBuildingExercise = ({
  question,
  correctAnswer,
  availableWords,
  imageUrl,
  onCorrect,
  onIncorrect,
  hint
}: WordBuildingExerciseProps) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  
  // Ensure no duplicate words in availableWords
  const uniqueAvailableWords = [...new Set(availableWords)];
  
  const handleSelectWord = (word: string) => {
    setSelectedWords([...selectedWords, word]);
  };
  
  const handleRemoveWord = (index: number) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
  };
  
  const handleCheck = () => {
    const userAnswer = selectedWords.join(' ').toLowerCase().trim();
    const isCorrect = userAnswer === correctAnswer.toLowerCase();
    
    setIsChecking(true);
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');
    
    // Play sound when correct
    if (isCorrect) {
      // Show fireworks animation
      setShowFireworks(true);
      
      // Play the correct answer sound
      playSoundEffect('correct');
      
      // Hide fireworks after animation completes
      setTimeout(() => {
        setShowFireworks(false);
      }, 2000);
    }
    
    setTimeout(() => {
      setIsChecking(false);
      setShowFeedback(null);
      
      if (isCorrect) {
        onCorrect();
      } else {
        // Reset the selected words on incorrect answer
        setSelectedWords([]);
        onIncorrect();
      }
    }, 1500);
  };
  
  const resetSelection = () => {
    setSelectedWords([]);
  };

  // Filter out words that have already been selected
  const remainingWords = uniqueAvailableWords.filter(word => !selectedWords.includes(word));

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Fireworks animation overlay */}
      <AnimatePresence>
        {showFireworks && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            {/* Fireworks particles */}
            <div className="relative w-full h-full">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`firework-${i}`}
                  className="absolute"
                  initial={{
                    top: '50%',
                    left: '50%',
                    scale: 0,
                  }}
                  animate={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                    times: [0, 0.5, 1],
                    delay: Math.random() * 0.2,
                  }}
                >
                  <div className={`h-2 w-2 rounded-full ${['bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'][Math.floor(Math.random() * 6)]}`}></div>
                </motion.div>
              ))}
              
              {/* Center firework icon */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                transition={{ duration: 0.5 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <CheckCircle className="h-20 w-20 text-yellow-500" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Visual feedback overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-40 flex items-center justify-center pointer-events-none`}
          >
            <div className={`text-6xl ${showFeedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
              {showFeedback === 'correct' ? '✓' : '✗'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`p-6 rounded-lg shadow-lg mb-6 ${
        showFeedback === 'correct' ? 'bg-green-50 border border-green-200' : 
        showFeedback === 'incorrect' ? 'bg-red-50 border border-red-200' : 
        'bg-white border border-gray-200'
      }`}>
        <div className="flex items-start gap-4 mb-6">
          {imageUrl && (
            <div className="flex-shrink-0">
              <img src={imageUrl} alt="" className="w-20 h-20 object-cover rounded-full" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 inline-flex items-center">
              <span className="mr-1">NEW WORD</span>
            </div>
            <h2 className="text-xl font-bold mb-2">{question}</h2>
            {hint && (
              <div className="mt-2 mb-3">
                <SpeechControls text={hint} language={hint.match(/[áéíóúñ¿¡]/i) ? 'es' : 'en'} />
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Remember that you can always hover over words to see what they mean.
            </p>
          </div>
        </div>

        {/* Selected words area */}
        <div className="min-h-12 p-3 border border-dashed border-gray-300 rounded-md mb-4 flex flex-wrap gap-2">
          {selectedWords.length === 0 ? (
            <p className="text-gray-400 text-sm">Select words to build the answer</p>
          ) : (
            selectedWords.map((word, index) => (
              <Button
                key={`selected-${word}-${index}`}
                variant="outline"
                size="sm"
                className="bg-blue-50 border-blue-200 hover:bg-blue-100"
                onClick={() => handleRemoveWord(index)}
              >
                {word}
              </Button>
            ))
          )}
        </div>

        {/* Available words */}
        <div className="flex flex-wrap gap-2 mb-6">
          {remainingWords.map((word, index) => (
            <Button
              key={`available-${word}-${index}`}
              variant="outline"
              size="sm"
              onClick={() => handleSelectWord(word)}
              disabled={isChecking}
            >
              {word}
            </Button>
          ))}
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetSelection}
            disabled={selectedWords.length === 0 || isChecking}
          >
            Clear
          </Button>
          <Button
            onClick={handleCheck}
            disabled={selectedWords.length === 0 || isChecking}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Check
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WordBuildingExercise;
