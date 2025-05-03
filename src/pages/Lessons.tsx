
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Star } from 'lucide-react';
import { categories, flashcards } from '@/data/flashcards';
import FoxMascot from '@/components/FoxMascot';

const Lessons = () => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [xpPoints, setXpPoints] = useState<number>(localStorage.getItem('xpPoints') ? parseInt(localStorage.getItem('xpPoints') || '0') : 0);
  
  // Filter for beginner content only
  const beginnerFlashcards = flashcards.filter(card => card.difficulty === 'beginner');
  
  // Group flashcards by category
  const groupedFlashcards = beginnerFlashcards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, typeof flashcards>);
  
  const lessonCategories = categories.filter(category => 
    groupedFlashcards[category.id] && groupedFlashcards[category.id].length > 0
  );

  const handleBack = () => {
    navigate('/learning-path');
  };

  const handleSelectLesson = (categoryId: string) => {
    setSelectedLesson(categoryId);
  };

  const handleStartLearning = () => {
    if (selectedLesson) {
      // Add some XP for selecting a lesson
      const newXp = xpPoints + 5;
      setXpPoints(newXp);
      localStorage.setItem('xpPoints', newXp.toString());
      localStorage.setItem('selectedCategory', selectedLesson);
      
      // Navigate to the lesson page with the selected category
      navigate(`/lesson?category=${selectedLesson}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2"
            onClick={handleBack}
          >
            <ArrowLeft size={18} /> Back to Learning Path
          </Button>
          
          <div className="flex items-center gap-2 bg-spanish-yellow text-gray-800 px-3 py-1 rounded-full animate-bounce-in">
            <Star className="text-spanish-orange" size={18} />
            <span className="font-bold">{xpPoints} XP</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden">
            <FoxMascot emotion={selectedLesson ? "happy" : "neutral"} />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold text-spanish-teal mb-2">Beginner Spanish Lessons</h1>
            <p className="text-lg text-gray-600">¡Hola! Choose a fun lesson category to start learning Spanish!</p>
            
            {selectedLesson && (
              <div className="mt-4 p-3 bg-spanish-lightTeal rounded-lg animate-bounce-in">
                <p className="text-spanish-teal font-medium">
                  ¡Excelente elección! This lesson will help you master essential Spanish {
                    categories.find(cat => cat.id === selectedLesson)?.name.toLowerCase()
                  }.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {lessonCategories.map((category) => {
            const categoryCards = groupedFlashcards[category.id] || [];
            return (
              <Card 
                key={category.id}
                className={`border-0 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 ${
                  selectedLesson === category.id 
                    ? 'ring-4 ring-spanish-teal shadow-lg' 
                    : ''
                }`}
                style={{
                  background: selectedLesson === category.id 
                    ? `linear-gradient(135deg, ${category.gradient.from} 0%, ${category.gradient.to} 100%)` 
                    : 'white'
                }}
                onClick={() => handleSelectLesson(category.id)}
              >
                <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-spanish-orange rounded-full opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 -ml-8 -mb-8 bg-spanish-teal rounded-full opacity-10"></div>
                
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="text-5xl mr-4 bg-white bg-opacity-90 rounded-full p-3 shadow-md">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 ${
                        selectedLesson === category.id ? 'text-white' : 'text-gray-800'
                      }`}>
                        {category.name}
                      </h3>
                      <p className={`${selectedLesson === category.id ? 'text-white opacity-90' : 'text-gray-600'}`}>
                        {categoryCards.length} fun {category.name.toLowerCase()} exercises
                      </p>
                      
                      <div className={`mt-4 ${selectedLesson === category.id ? 'text-white opacity-90' : 'text-gray-700'}`}>
                        <div className="flex items-center gap-1 mb-2">
                          <BookOpen size={16} />
                          <h4 className="font-medium">Quick Preview:</h4>
                        </div>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {categoryCards.slice(0, 2).map((card) => (
                            <li key={card.id}>
                              <span className="font-medium">{card.spanish}</span>
                              {selectedLesson === category.id && <span> - {card.english}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedLesson === category.id && (
                        <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-2 text-sm text-white">
                          <p><span className="font-bold">Difficulty:</span> Beginner</p>
                          <p><span className="font-bold">Time:</span> ~10 minutes</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex justify-center mb-10">
          <Button
            className={`${
              selectedLesson ? 'bg-spanish-red hover:bg-spanish-darkred' : 'bg-gray-300'
            } text-white px-8 py-6 text-xl rounded-full transition-all duration-300 transform ${
              selectedLesson ? 'hover:scale-105 animate-bounce-in' : ''
            }`}
            disabled={!selectedLesson}
            onClick={handleStartLearning}
          >
            {selectedLesson ? '¡Empezar a Aprender!' : 'Select a Lesson'}
          </Button>
        </div>
        
        <div className="bg-gradient-to-r from-spanish-lightTeal to-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-spanish-teal mb-3">Why These Lessons?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="bg-spanish-teal text-white rounded-full p-1 mt-1">
                <Star size={16} />
              </div>
              <p>Build <span className="font-bold text-spanish-teal">essential vocabulary</span> through engaging exercises</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-spanish-orange text-white rounded-full p-1 mt-1">
                <Star size={16} />
              </div>
              <p>Learn with <span className="font-bold text-spanish-orange">AI-powered personalization</span> for your learning style</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-spanish-red text-white rounded-full p-1 mt-1">
                <Star size={16} />
              </div>
              <p>Track your <span className="font-bold text-spanish-red">progress and earn rewards</span> as you improve</p>
            </li>
          </ul>
        </div>
      </main>
      
      <footer className="bg-gradient-to-r from-spanish-darkteal to-spanish-teal text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Habla Con Fuego - Spanish Learning App</p>
          <p className="text-sm opacity-80 mt-1">¡Aprende español de manera divertida!</p>
        </div>
      </footer>
    </div>
  );
};

export default Lessons;
