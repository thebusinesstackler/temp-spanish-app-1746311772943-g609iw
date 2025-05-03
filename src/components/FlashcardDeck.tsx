import { useState, useEffect } from 'react';
import { Flashcard as FlashcardType } from '@/data/flashcards';
import Flashcard from '@/components/Flashcard';
import StudyControls from '@/components/StudyControls';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FlashcardDeckProps {
  flashcards: FlashcardType[];
  mode: 'spanish-english' | 'english-spanish';
  onCardComplete?: (correct: boolean) => void;
  onSessionComplete?: (correctCount: number, incorrectCount: number) => void;
  hearts?: number;
  redirectPath?: string;
}

type ExerciseType = 'flashcard' | 'word-building' | 'multiple-choice';

const FlashcardDeck = ({ 
  flashcards, 
  mode,
  onCardComplete,
  onSessionComplete,
  hearts = 5,
  redirectPath
}: FlashcardDeckProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [currentExerciseType, setCurrentExerciseType] = useState<ExerciseType>('flashcard');
  const [masteredCards, setMasteredCards] = useState<FlashcardType[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const navigate = useNavigate();
  
  // Shuffle cards initially
  const [shuffledCards, setShuffledCards] = useState<FlashcardType[]>([]);

  useEffect(() => {
    if (flashcards.length > 0) {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setCurrentCardIndex(0);
      setCorrectCount(0);
      setIncorrectCount(0);
      setIsComplete(false);
      setRecoveryAttempts({});
      setMasteredCards([]);
      setReviewMode(false);
      
      // Set exercise type randomly but with appropriate distribution
      setRandomExerciseType();
    }
  }, [flashcards]);
  
  // Set a random exercise type with a balanced distribution
  const setRandomExerciseType = () => {
    const randomValue = Math.random();
    
    if (randomValue < 0.4) {
      setCurrentExerciseType('flashcard');
    } else if (randomValue < 0.8) {
      setCurrentExerciseType('word-building'); 
    } else {
      setCurrentExerciseType('multiple-choice');
    }
  };

  const handleCorrect = () => {
    // Show positive feedback
    setShowFeedback('correct');
    
    // Play correct sound
    playSoundEffect('correct');
    
    // Track correct answers and mastered cards
    setCorrectCount(correctCount + 1);
    if (!reviewMode) {
      setMasteredCards([...masteredCards, shuffledCards[currentCardIndex]]);
    }
    
    onCardComplete?.(true);
    
    // Delay advancing to next card for feedback visibility
    setTimeout(() => {
      setShowFeedback(null);
      advanceCard();
    }, 1200);
  };

  const handleIncorrect = () => {
    // Show negative feedback
    setShowFeedback('incorrect');
    
    // Track recovery attempts for this card
    const currentAttempts = recoveryAttempts[currentCardIndex] || 0;
    setRecoveryAttempts({
      ...recoveryAttempts,
      [currentCardIndex]: currentAttempts + 1
    });
    
    // After 2 attempts, move on but count as incorrect
    if (currentAttempts >= 1) {
      setIncorrectCount(incorrectCount + 1);
      onCardComplete?.(false);
      
      // Delay advancing to next card for feedback visibility
      setTimeout(() => {
        setShowFeedback(null);
        advanceCard();
      }, 1200);
    } else {
      // Show hint but don't advance
      setTimeout(() => {
        setShowFeedback(null);
      }, 1200);
    }
  };

  const advanceCard = () => {
    // Check if out of hearts
    if (hearts !== undefined && hearts <= 0) {
      setIsComplete(true);
      onSessionComplete?.(correctCount, incorrectCount);
      return;
    }
    
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      // Set a new exercise type for the next card
      setRandomExerciseType();
    } else {
      // If we're already in review mode, finish the session
      if (reviewMode) {
        setIsComplete(true);
        onSessionComplete?.(correctCount, incorrectCount);
      } else {
        // Otherwise, enter review mode with mastered cards
        if (masteredCards.length > 0) {
          startReviewMode();
        } else {
          setIsComplete(true);
          onSessionComplete?.(correctCount, incorrectCount);
        }
      }
    }
  };
  
  // Start the review mode with mastered cards
  const startReviewMode = () => {
    setReviewMode(true);
    // Shuffle the mastered cards for review
    const shuffledMastered = [...masteredCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffledMastered);
    setCurrentCardIndex(0);
    setRecoveryAttempts({});
  };

  const resetDeck = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentCardIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsComplete(false);
    setRecoveryAttempts({});
    setMasteredCards([]);
    setReviewMode(false);
    setRandomExerciseType();
  };

  const handleCompleteLesson = () => {
    // Navigate to redirectPath if provided or to learning path otherwise
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      navigate('/learning-path');
    }
  };
  
  // Helper function to play sound effects
  const playSoundEffect = (type: 'correct' | 'incorrect' | 'complete') => {
    try {
      const audio = new Audio('/correct-answer.mp3');
      audio.volume = 1.0; // Maximum volume
      audio.play();
    } catch (error) {
      console.error('Failed to play sound effect:', error);
    }
  };

  if (shuffledCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-500">No flashcards available for this category.</p>
      </div>
    );
  }

  if (isComplete) {
    const totalCards = correctCount + incorrectCount;
    const percentage = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-white to-blue-50 p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Session Complete!</h2>
        
        <div className="flex justify-between w-full max-w-xs mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">{correctCount}</div>
            <div className="text-sm text-gray-500">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700">{totalCards}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">{incorrectCount}</div>
            <div className="text-sm text-gray-500">Incorrect</div>
          </div>
        </div>
        
        <div className="w-full max-w-xs mb-6">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="text-center mt-2">
            <span className="font-bold">{percentage}%</span> success rate
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={resetDeck}
            variant="outline"
            className="border-spanish-red text-spanish-red hover:bg-spanish-red/10"
          >
            Study Again
          </Button>
          
          <Button
            onClick={handleCompleteLesson}
            className="bg-spanish-teal hover:bg-spanish-darkteal text-white"
          >
            Continue to Next Lesson
          </Button>
        </div>
      </motion.div>
    );
  }

  // Get current card
  const currentCard = shuffledCards[currentCardIndex];
  
  // Show recovery hint if applicable
  const showRecoveryHint = recoveryAttempts[currentCardIndex] && recoveryAttempts[currentCardIndex] > 0;

  return (
    <div className="flex flex-col">
      {/* Visual feedback overlay */}
      {showFeedback && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}
        >
          <div className={`text-6xl ${showFeedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
            {showFeedback === 'correct' ? '✓' : '✗'}
          </div>
        </motion.div>
      )}
      
      {/* Review mode indicator */}
      {reviewMode && (
        <div className="bg-spanish-orange text-white text-center py-2 rounded-md mb-4">
          Review Mode: Let's reinforce what you've learned!
        </div>
      )}
      
      <Flashcard 
        flashcard={currentCard} 
        mode={mode}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        showHint={showRecoveryHint}
        feedback={showFeedback}
        exerciseType={currentExerciseType}
      />
      
      <StudyControls
        cardCount={shuffledCards.length}
        currentCardIndex={currentCardIndex}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        onReset={resetDeck}
      />
    </div>
  );
};

export default FlashcardDeck;
