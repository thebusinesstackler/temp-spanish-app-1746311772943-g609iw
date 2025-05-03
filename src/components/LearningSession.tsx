
import { useState, useEffect } from 'react';
import { Flashcard as FlashcardType } from '@/data/flashcards';
import FlashcardDeck from './FlashcardDeck';
import SessionProgress from './SessionProgress';
import MicroBreak from './MicroBreak';
import { Trophy, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LearningSessionProps {
  flashcards: FlashcardType[];
  mode: 'spanish-english' | 'english-spanish';
}

const LearningSession = ({ flashcards, mode }: LearningSessionProps) => {
  const [sessionConfig, setSessionConfig] = useState({
    newCardsPerSession: 5,
    reviewCardsPerSession: 7,
    microBreakInterval: 10,
    currentUserLevel: 1,
    maxHearts: 5
  });
  
  // Split cards into new and review (using a simple rule for now)
  const [newCards, setNewCards] = useState<FlashcardType[]>([]);
  const [reviewCards, setReviewCards] = useState<FlashcardType[]>([]);
  
  const [showMicroBreak, setShowMicroBreak] = useState(false);
  const [cardsCompleted, setCardsCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [hearts, setHearts] = useState(sessionConfig.maxHearts);
  const [showHeartsDialog, setShowHeartsDialog] = useState(false);
  
  // Initialize session
  useEffect(() => {
    if (flashcards.length > 0) {
      // Simple mock implementation - in a real app, this would use algorithm-based selection
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setNewCards(shuffled.slice(0, sessionConfig.newCardsPerSession));
      setReviewCards(shuffled.slice(sessionConfig.newCardsPerSession, sessionConfig.newCardsPerSession + sessionConfig.reviewCardsPerSession));
      setSessionStartTime(new Date());
      setHearts(sessionConfig.maxHearts);
    }
  }, [flashcards]);

  // Show hearts dialog when starting a new session
  useEffect(() => {
    if (sessionStartTime) {
      setShowHeartsDialog(true);
    }
  }, [sessionStartTime]);

  // Combined cards for study session - interleaving new and review cards
  const sessionCards = [...newCards, ...reviewCards].sort(() => Math.random() - 0.5);

  const handleCardComplete = (correct: boolean) => {
    setCardsCompleted(prev => prev + 1);
    
    // Update streak and hearts
    if (correct) {
      setCurrentStreak(prev => prev + 1);
      // Play correct answer sound
      const audio = new Audio('/correct-answer.mp3');
      audio.play().catch(error => {
        console.info("Audio playback error:", error);
      });
    } else {
      // Non-punitive approach for streak - don't reset completely
      setCurrentStreak(prev => Math.max(0, prev - 1));
      // Reduce hearts
      setHearts(prev => Math.max(0, prev - 1));
      
      // Show toast notification about losing a heart
      toast.error("You lost a heart! Be careful!", {
        icon: <Heart className="text-red-500 fill-red-500" />
      });
      
      // Check if out of hearts
      if (hearts <= 1) {
        toast.error("You're out of hearts! Session ending.", {
          icon: <Heart className="text-red-500 fill-red-500" />
        });
      }
    }
    
    // Check if it's time for a micro-break
    if (cardsCompleted > 0 && cardsCompleted % sessionConfig.microBreakInterval === 0) {
      setShowMicroBreak(true);
    }
  };

  const handleMicroBreakComplete = () => {
    setShowMicroBreak(false);
  };

  const handleSessionComplete = (correctCount: number, incorrectCount: number) => {
    // Adjust difficulty based on performance
    const totalCards = correctCount + incorrectCount;
    const successRate = totalCards > 0 ? correctCount / totalCards : 0;
    
    setSessionConfig(prev => {
      // Dynamically adjust based on performance
      const newConfig = { ...prev };
      
      if (successRate > 0.8 && prev.newCardsPerSession < 12) {
        // User is doing well, increase new cards slightly
        newConfig.newCardsPerSession = prev.newCardsPerSession + 1;
      } else if (successRate < 0.6 && prev.newCardsPerSession > 3) {
        // User is struggling, decrease new cards
        newConfig.newCardsPerSession = prev.newCardsPerSession - 1;
      }
      
      return newConfig;
    });
  };

  // If no cards available yet
  if (sessionCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-500">Preparing your personalized learning session...</p>
      </div>
    );
  }

  // Show micro-break
  if (showMicroBreak) {
    return (
      <MicroBreak 
        streak={currentStreak}
        onComplete={handleMicroBreakComplete}
      />
    );
  }

  // Out of hearts
  if (hearts === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg">
        <div className="flex mb-4">
          {Array.from({ length: sessionConfig.maxHearts }).map((_, i) => (
            <Heart 
              key={i} 
              className={`w-8 h-8 mx-1 ${i < hearts ? "text-red-500 fill-red-500" : "text-gray-300"}`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">You're out of hearts!</h2>
        <p className="text-gray-600 mb-6 text-center">Take a break and try again later to continue your learning journey.</p>
        <Button 
          onClick={() => {
            // Reset the session
            setHearts(sessionConfig.maxHearts);
            setCardsCompleted(0);
            setCurrentStreak(0);
            const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
            setNewCards(shuffled.slice(0, sessionConfig.newCardsPerSession));
            setReviewCards(shuffled.slice(sessionConfig.newCardsPerSession, sessionConfig.newCardsPerSession + sessionConfig.reviewCardsPerSession));
          }}
          className="bg-spanish-red hover:bg-spanish-darkred text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="learning-session space-y-6">
      <div className="flex justify-between items-center">
        <SessionProgress 
          newCards={newCards.length}
          reviewCards={reviewCards.length}
          cardsCompleted={cardsCompleted}
          totalCards={sessionCards.length}
          streak={currentStreak}
          userLevel={sessionConfig.currentUserLevel}
        />
        
        <div className="flex">
          {Array.from({ length: sessionConfig.maxHearts }).map((_, i) => (
            <Heart 
              key={i} 
              className={`w-6 h-6 ${i < hearts ? "text-red-500 fill-red-500" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>
      
      <FlashcardDeck 
        flashcards={sessionCards}
        mode={mode}
        onCardComplete={handleCardComplete}
        onSessionComplete={handleSessionComplete}
        hearts={hearts}
      />
      
      {/* Hearts explanation dialog */}
      <Dialog open={showHeartsDialog} onOpenChange={setShowHeartsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Each mistake costs 1 heart!</DialogTitle>
            <DialogDescription>
              Stay sharp and focused to keep your hearts. You start with {sessionConfig.maxHearts} hearts.
              If you run out of hearts, the session will end.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center my-4">
            {Array.from({ length: sessionConfig.maxHearts }).map((_, i) => (
              <Heart key={i} className="w-8 h-8 mx-1 text-red-500 fill-red-500" />
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={() => setShowHeartsDialog(false)} className="bg-blue-500 hover:bg-blue-600">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningSession;
