
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Award, Star } from "lucide-react";
import FoxMascot from './FoxMascot';

interface NavbarProps {
  studyMode?: 'spanish-english' | 'english-spanish';
  onStudyModeChange?: (mode: 'spanish-english' | 'english-spanish') => void;
}

const Navbar = ({ studyMode = 'spanish-english', onStudyModeChange }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userLanguage, setUserLanguage] = useState<string>('Spanish');
  const [xp, setXp] = useState(100);
  const [streak, setStreak] = useState(5);
  const [showFoxMessage, setShowFoxMessage] = useState(false);
  
  useEffect(() => {
    // Get the selected language from localStorage
    const storedLanguage = localStorage.getItem('learningLanguage');
    if (storedLanguage) {
      setUserLanguage(storedLanguage);
    }
  }, []);

  const handleModeChange = (mode: 'spanish-english' | 'english-spanish') => {
    if (onStudyModeChange) {
      onStudyModeChange(mode);
    }
  };

  const handleRestart = () => {
    // Clear onboarding data and redirect to welcome
    localStorage.removeItem('learningLanguage');
    localStorage.removeItem('learningReason');
    navigate('/welcome');
  };

  const toggleFoxMessage = () => {
    setShowFoxMessage(!showFoxMessage);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  }

  return (
    <div className="flex flex-col w-full">
      <nav className="flex items-center justify-between p-4 bg-spanish-teal text-white">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-spanish-teal/80 p-0 m-0"
              onClick={toggleFoxMessage}
            >
              <FoxMascot 
                size="sm" 
                className="mr-2"
                message="¡Hola! ¿Cómo estás? Looking good today!"
                showMessage={showFoxMessage}
                onMessageClose={() => setShowFoxMessage(false)}
              />
            </Button>
          </div>
          
          <div>
            <span className="text-2xl font-bold">Habla con Fuego</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded ml-2">Learning {userLanguage}</span>
          </div>
        </div>
        
        {/* XP and Streak display */}
        <div className="hidden md:flex items-center gap-4 px-4">
          <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
            <Award className="h-4 w-4 mr-1 text-yellow-300" />
            <span className="text-sm">{xp} XP</span>
          </div>
          
          <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
            <Trophy className="h-4 w-4 mr-1 text-orange-300" />
            <span className="text-sm">{streak} days</span>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleRestart}>
          Restart
        </Button>
      </nav>
      
      {/* Mobile app style navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex justify-around items-center p-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center text-xs py-2 ${isActive('/learning-path') ? 'text-spanish-teal' : 'text-gray-500'}`}
          onClick={() => navigate('/learning-path')}
        >
          <Award size={20} />
          <span>Progress</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center text-xs py-2 ${isActive('/lessons') ? 'text-spanish-teal' : 'text-gray-500'}`}
          onClick={() => navigate('/lessons')}
        >
          <Trophy size={20} />
          <span>Lessons</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center text-xs py-2 ${isActive('/flashcards') ? 'text-spanish-teal' : 'text-gray-500'}`}
          onClick={() => navigate('/flashcards')}
        >
          <Star size={20} />
          <span>Flashcards</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center text-xs py-2 ${isActive('/conversation-ai') ? 'text-spanish-teal' : 'text-gray-500'}`}
          onClick={() => navigate('/conversation-ai')}
        >
          <Trophy size={20} />
          <span>Speak</span>
        </Button>
      </div>
      
      {/* Add padding at the bottom to prevent content from being hidden by the bottom navigation */}
      <div className="pb-16 md:pb-0"></div>
    </div>
  );
};

export default Navbar;
