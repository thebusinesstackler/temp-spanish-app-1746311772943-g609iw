
import { useState, useEffect, useRef } from 'react';
import { Flashcard as FlashcardType } from '@/data/flashcards';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import WordBuildingExercise from './WordBuildingExercise';
import { playAudio, preloadVoices, playSoundEffect } from '@/services/textToSpeech';
import SpeechControls from './SpeechControls';

interface FlashcardProps {
  flashcard: FlashcardType;
  mode: 'spanish-english' | 'english-spanish';
  onCorrect: () => void;
  onIncorrect: () => void;
  showHint?: boolean;
  feedback: 'correct' | 'incorrect' | null;
  exerciseType?: 'flashcard' | 'word-building' | 'multiple-choice';
}

const Flashcard = ({ 
  flashcard, 
  mode, 
  onCorrect, 
  onIncorrect, 
  showHint = false, 
  feedback = null,
  exerciseType = 'flashcard'
}: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element for correct answer sound
    correctSoundRef.current = new Audio('/correct-answer.mp3');
    
    // Reset flip state when flashcard changes
    setFlipped(false);
    
    // Preload voices for speech synthesis
    preloadVoices();
  }, [flashcard]);

  const flipCard = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setFlipped(!flipped);
    
    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const handleResponse = (correct: boolean) => {
    if (correct) {
      // Play sound when answer is correct
      playSoundEffect('correct');
      onCorrect();
    } else {
      onIncorrect();
    }
    setFlipped(false);
  };

  const handlePlayAudio = async (text: string) => {
    if (isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    try {
      // Use the Web Speech API-based text-to-speech service
      await playAudio(text, { 
        languageCode: 'es',  // Specify Spanish
        rate: 0.85,          // Slightly slower rate for learning
        volume: 1.0,         // Full volume
        cacheKey: `spanish_${text}`
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  // Set front and back text based on mode
  // In english-spanish mode, front is English and back is Spanish
  // In spanish-english mode, front is Spanish and back is English
  const frontText = mode === 'spanish-english' ? flashcard.spanish : flashcard.english;
  const backText = mode === 'spanish-english' ? flashcard.english : flashcard.spanish;

  // Create a hint (first letter + length indicator)
  const createHint = (text: string) => {
    return `${text.charAt(0)}${text.slice(1).replace(/[a-zA-Z]/g, '_ ')}`;
  };

  // Determine card background based on feedback
  const cardBackground = feedback === 'correct' 
    ? 'animate-pulse bg-gradient-to-br from-green-50 to-emerald-100 border-green-300' 
    : feedback === 'incorrect'
    ? 'bg-gradient-to-br from-red-50 to-rose-100 border-red-300'
    : 'bg-gradient-to-br from-white to-blue-50 border-gray-200';

  // Generate words for word building exercise with no duplicates
  const getWordBuildingWords = () => {
    // Split the answer into words
    const answerWords = backText.toLowerCase()
      .split(' ')
      .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates
    
    // Add distractors based on the mode (avoiding duplicates)
    let distractors: string[] = [];
    
    if (mode === 'spanish-english') {
      distractors = ['the', 'a', 'an', 'is', 'am', 'are', 'I', 'you', 'he', 'she', 'it', 'they', 'we', 'this', 'that'];
    } else {
      distractors = ['el', 'la', 'un', 'una', 'es', 'soy', 'eres', 'yo', 'tú', 'él', 'ella', 'ellos', 'nosotros', 'este', 'esta'];
    }
    
    // Filter out any distractors that are already in the answer
    const filteredDistractors = distractors.filter(d => 
      !answerWords.includes(d.toLowerCase()) && 
      !answerWords.includes(d.toLowerCase() + 's') // Also exclude plurals
    );
    
    // Take random distractors to add to the mix
    const randomDistractors = filteredDistractors
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(7, 10 - answerWords.length));
    
    // Combine answer words and distractors, then shuffle
    return [...answerWords, ...randomDistractors].sort(() => Math.random() - 0.5);
  };

  // If exercise type is word-building, render that component
  if (exerciseType === 'word-building') {
    return (
      <WordBuildingExercise
        question={`Write this in ${mode === 'spanish-english' ? 'English' : 'Spanish'}`}
        correctAnswer={backText}
        availableWords={getWordBuildingWords()}
        hint={frontText}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />
    );
  }
  
  // Otherwise render the regular flashcard
  return (
    <motion.div 
      key={flashcard.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className={`flashcard ${flipped ? 'flipped' : ''} h-64 w-full cursor-pointer`} onClick={flipCard}>
        <div className="flashcard-inner h-full w-full relative">
          <Card className={`flashcard-front flex items-center justify-center p-6 h-full ${cardBackground} shadow-lg`}>
            <div className="text-center">
              <div className="text-3xl font-bold mb-4">{frontText}</div>
              {/* Audio controls on front */}
              {mode === 'spanish-english' && (
                <div className="mt-4">
                  <SpeechControls text={frontText} language="es" />
                </div>
              )}
              {showHint && !flipped && (
                <div className="text-sm text-amber-600 mb-2">
                  Hint: {mode === 'spanish-english' 
                    ? createHint(flashcard.english) 
                    : createHint(flashcard.spanish)}
                </div>
              )}
              <div className="text-sm text-gray-500 mt-4">Click to flip</div>
            </div>
          </Card>
          <Card className={`flashcard-back flex flex-col items-center justify-center p-6 h-full ${cardBackground} shadow-lg`}>
            <div className="text-center">
              <div className="text-3xl font-bold mb-4">{backText}</div>
              {flashcard.exampleSentence && (
                <div className="text-sm italic text-gray-600 mb-4">
                  "{flashcard.exampleSentence}"
                </div>
              )}
              {/* Audio controls for Spanish pronunciation on back */}
              <div className="mt-4">
                <SpeechControls 
                  text={mode === 'english-spanish' ? backText : frontText} 
                  language="es"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button 
          variant="outline" 
          className="border-2 border-red-500 text-red-500 hover:bg-red-50 shadow-sm transition-all hover:scale-105"
          onClick={() => handleResponse(false)}
        >
          Incorrect
        </Button>
        <Button 
          variant="outline" 
          className="border-2 border-green-500 text-green-500 hover:bg-green-50 shadow-sm transition-all hover:scale-105"
          onClick={() => handleResponse(true)}
        >
          Correct
        </Button>
      </div>
    </motion.div>
  );
};

export default Flashcard;
