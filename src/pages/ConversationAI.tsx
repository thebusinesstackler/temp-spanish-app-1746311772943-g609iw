import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ConversationAI from '@/components/ConversationAI';
import FoxMascot from '@/components/FoxMascot';
import { Button } from '@/components/ui/button';
import { Mic, Book, Home, Map } from 'lucide-react';

const ConversationAIPage = () => {
  const navigate = useNavigate();
  const hasOnboarded = localStorage.getItem('learningLanguage') !== null;
  
  // Redirect to welcome page if user hasn't completed onboarding
  useEffect(() => {
    if (!hasOnboarded) {
      navigate('/welcome');
    }
  }, [hasOnboarded, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-4 pb-16">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 overflow-hidden">
              <FoxMascot emotion="happy" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-spanish-teal mb-1">Conversation AI</h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Record and translate Spanish conversations to enhance your learning
          </p>
        </div>
        
        <ConversationAI />
      </main>
      
      {/* Mobile app-style bottom navigation */}
      <div className="bottom-nav">
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center justify-center h-14 rounded-none"
          onClick={() => navigate('/learning-path')}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center justify-center h-14 rounded-none"
          onClick={() => navigate('/lesson-roadmap')}
        >
          <Map size={20} />
          <span className="text-xs mt-1">Roadmap</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center justify-center h-14 rounded-none"
          onClick={() => navigate('/flashcards')}
        >
          <Book size={20} />
          <span className="text-xs mt-1">Learn</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center justify-center h-14 rounded-none bg-sky-50"
          onClick={() => navigate('/conversation-ai')}
        >
          <Mic size={20} className="text-spanish-teal" />
          <span className="text-xs mt-1 text-spanish-teal">Practice</span>
        </Button>
      </div>
      
      <footer className="bg-gradient-to-r from-spanish-darkteal to-spanish-teal text-white py-4 mt-4 hidden md:block">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Habla Con Fuego - Spanish Learning App</p>
          <p className="text-xs opacity-80">¡Aprende español de manera divertida!</p>
        </div>
      </footer>
    </div>
  );
};

export default ConversationAIPage;
