import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CategorySelector from '@/components/CategorySelector';
import LearningSession from '@/components/LearningSession';
import { flashcards } from '@/data/flashcards';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Default to spanish-english only, no toggle needed
  const studyMode = 'spanish-english';
  const [language, setLanguage] = useState<string>("Spanish");
  const [learnedCategories, setLearnedCategories] = useState<string[]>([]);
  const [studyLearnedOnly, setStudyLearnedOnly] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if there's a selected category in localStorage (from learning path)
    const storedCategory = localStorage.getItem('selectedCategory');
    if (storedCategory) {
      setSelectedCategory(storedCategory);
      toast.info(`Ready to learn ${storedCategory} words & phrases!`);
      // Remove it from localStorage to avoid persistence across visits
      localStorage.removeItem('selectedCategory');
    }
    
    // Get stored language
    const storedLanguage = localStorage.getItem('learningLanguage');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // Get learned categories from localStorage
    const learned = localStorage.getItem('learnedCategories');
    if (learned) {
      setLearnedCategories(JSON.parse(learned));
    }
  }, []);
  
  // Mark current category as learned when user studies it
  useEffect(() => {
    if (selectedCategory && !learnedCategories.includes(selectedCategory)) {
      const updatedLearned = [...learnedCategories, selectedCategory];
      setLearnedCategories(updatedLearned);
      localStorage.setItem('learnedCategories', JSON.stringify(updatedLearned));
    }
  }, [selectedCategory]);

  // Filter flashcards based on selected category and "learned only" mode
  const getFilteredFlashcards = () => {
    let filtered = flashcards;
    
    // First filter by selected category if there is one
    if (selectedCategory) {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }
    
    // Then filter by learned categories if in "learned only" mode
    if (studyLearnedOnly) {
      filtered = filtered.filter(card => learnedCategories.includes(card.category));
    }
    
    return filtered;
  };
  
  const filteredFlashcards = getFilteredFlashcards();
  
  const toggleStudyLearnedOnly = () => {
    setStudyLearnedOnly(!studyLearnedOnly);
    if (!studyLearnedOnly) {
      toast.info("Now showing only flashcards from lessons you've studied!");
    } else {
      toast.info("Now showing all available flashcards");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Navbar studyMode={studyMode} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Spanish Learning App</h1>
          <p className="text-lg text-gray-600">Master {language} with our flashcard system</p>
        </motion.div>

        <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-blue-100">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex mb-4 md:mb-0">
              <div className="px-4 py-2 rounded-md bg-white shadow-sm text-spanish-red">
                Spanish → English
              </div>
            </div>
            
            {learnedCategories.length > 0 && (
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  studyLearnedOnly
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={toggleStudyLearnedOnly}
              >
                {studyLearnedOnly ? "Studying Learned Only" : "Study All Flashcards"}
              </button>
            )}
          </div>
          
          <CategorySelector
            onSelectCategory={(categoryId) => setSelectedCategory(categoryId)}
            selectedCategory={selectedCategory}
            learnedCategories={learnedCategories}
          />
          
          {selectedCategory ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <LearningSession flashcards={filteredFlashcards} mode={studyMode} />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
            >
              <h3 className="text-xl font-medium text-gray-700">Select a category to start studying</h3>
              <p className="text-gray-500 mt-2">Choose from the categories above to begin your {language} learning journey</p>
              {studyLearnedOnly && learnedCategories.length === 0 && (
                <p className="text-amber-600 mt-4">You haven't studied any categories yet. Complete some lessons first!</p>
              )}
            </motion.div>
          )}
        </div>
      </main>
      
      <footer className="bg-gradient-to-r from-blue-800 to-spanish-darkred text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Spanish Learning App</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
