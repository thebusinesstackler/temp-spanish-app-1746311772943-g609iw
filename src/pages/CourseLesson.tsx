import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FoxMascot from '@/components/FoxMascot';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, BookOpen, Star, Trophy, Volume2, Loader2 } from 'lucide-react';
import { categories, flashcards } from '@/data/flashcards';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { playAudio, preloadVoices, playSoundEffect } from '@/services/textToSpeech';
import SpeechControls from '@/components/SpeechControls';

interface LessonQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageUrl?: string;
}

interface LessonContent {
  introduction: string;
  vocabulary: Array<{ word: string; translation: string; pronunciation?: string; exampleSentence?: string }>;
  questions: LessonQuestion[];
  summary: string;
}

const CourseLesson = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'intro' | 'vocabulary' | 'practice' | 'summary'>('intro');
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'excited' | 'thinking' | 'sad' | 'sleeping' | 'neutral'>('excited');
  const [mascotMessage, setMascotMessage] = useState('');
  const [showMascotMessage, setShowMascotMessage] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [exerciseMode, setExerciseMode] = useState<'spanish-english' | 'english-spanish'>('english-spanish');

  useEffect(() => {
    // Get the selected category from the URL or localStorage
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category') || localStorage.getItem('selectedCategory') || '';
    setSelectedCategory(categoryId);

    // Generate lesson content based on the category
    generateLessonContent(categoryId);
    
    // Preload voices for better speech synthesis experience
    preloadVoices();
    
    // Default to english-spanish mode
    setExerciseMode('english-spanish');
  }, [location]);

  useEffect(() => {
    // Update progress based on current step
    updateProgress();
  }, [currentStep, currentVocabIndex, currentQuestionIndex]);

  useEffect(() => {
    // Auto-start the lesson if coming directly to this page
    if (lessonContent && !lessonStarted) {
      setLessonStarted(true);
    }
  }, [lessonContent]);

  const generateLessonContent = (categoryId: string) => {
    // Find the category
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      navigate('/lessons');
      return;
    }
    
    // Get cards for this category
    const categoryCards = flashcards.filter(card => card.category === categoryId && card.difficulty === 'beginner');
    
    if (categoryCards.length === 0) {
      navigate('/lessons');
      return;
    }

    // Use up to 30 vocabulary words for animal lessons, otherwise use 8
    const maxVocabLength = categoryId === 'animals' ? 30 : 8;
    
    // Generate vocabulary list with pronunciation and example sentences
    const vocabulary = categoryCards.slice(0, maxVocabLength).map(card => {
      // Generate example sentences based on word type
      let exampleSentence = "";
      if (categoryId === 'animals') {
        exampleSentence = `The ${card.english.toLowerCase()} is an animal.`;
      } else if (categoryId === 'food') {
        exampleSentence = `I like to eat ${card.english.toLowerCase()}.`;
      } else if (categoryId === 'colors') {
        exampleSentence = `My favorite color is ${card.english.toLowerCase()}.`;
      } else if (categoryId === 'numbers') {
        exampleSentence = `I have ${card.english.toLowerCase()} books.`;
      } else if (categoryId === 'greetings') {
        exampleSentence = `${card.english} is a common greeting.`;
      } else {
        exampleSentence = `Try using "${card.english}" in a sentence.`;
      }
      
      return {
        word: card.spanish,
        translation: card.english,
        pronunciation: card.pronunciation || card.spanish.toLowerCase(),
        exampleSentence,
      };
    });

    // Create practice questions from the vocabulary (ensure no duplicate answers)
    const createQuestionsWithoutDuplicates = (vocabItem, index, allVocab) => {
      // Generate unique incorrect options
      const getUniqueIncorrectOptions = (correctAnswer, count) => {
        // Filter out the current word to avoid duplicate answers
        const remainingOptions = categoryCards
          .filter(c => c.english.toLowerCase() !== correctAnswer.toLowerCase())
          .map(c => c.english);
          
        // Shuffle and take the first count items
        return remainingOptions
          .sort(() => Math.random() - 0.5)
          .slice(0, count);
      };
      
      if (index % 3 === 0) {
        // Multiple choice translation question
        return {
          id: `q-mc-${index}`,
          question: `¿Qué significa "${vocabItem.word}"?`,
          options: [
            vocabItem.translation,
            ...getUniqueIncorrectOptions(vocabItem.translation, 3)
          ].sort(() => Math.random() - 0.5),
          correctAnswer: vocabItem.translation,
          explanation: `"${vocabItem.word}" means "${vocabItem.translation}" in English.`,
        };
      } else if (index % 3 === 1) {
        // Identify the correct Spanish word
        return {
          id: `q-id-${index}`,
          question: `Choose the correct Spanish word for "${vocabItem.translation}"`,
          options: [
            vocabItem.word,
            ...getUniqueIncorrectOptions(vocabItem.word, 3).map(word => {
              // Find a Spanish word for this English word
              const otherCard = categoryCards.find(c => c.english.toLowerCase() === word.toLowerCase());
              return otherCard ? otherCard.spanish : word;
            })
          ].sort(() => Math.random() - 0.5),
          correctAnswer: vocabItem.word,
          explanation: `"${vocabItem.translation}" in Spanish is "${vocabItem.word}".`,
        };
      } else {
        // Spelling exercise (word building)
        return {
          id: `q-spell-${index}`,
          question: `Spell the Spanish word for "${vocabItem.translation}"`,
          options: vocabItem.word.split('').concat([
            ...Array.from(new Set(allVocab.map(v => v.word)))
              .join('')
              .split('')
              .filter(char => !vocabItem.word.includes(char))
              .sort(() => Math.random() - 0.5)
              .slice(0, 5)
          ]).sort(() => Math.random() - 0.5),
          correctAnswer: vocabItem.word,
          explanation: `The correct spelling is "${vocabItem.word}".`,
          isSpelling: true,
        };
      }
    };
    
    // Generate questions with unique answers
    const questions = vocabulary.slice(0, Math.min(12, vocabulary.length)).map((vocab, index) =>
      createQuestionsWithoutDuplicates(vocab, index, vocabulary)
    );

    // Set the lesson content
    setLessonContent({
      introduction: `¡Bienvenido a tu lección de ${category.name}! In this fun lesson, you'll learn essential Spanish ${category.name.toLowerCase()} that will help you in everyday conversations. Let's make learning Spanish fun!`,
      vocabulary,
      questions,
      summary: `¡Excelente trabajo! You've completed your ${category.name} lesson. You now know ${vocabulary.length} new Spanish ${category.name.toLowerCase()} words that you can use right away. Keep practicing to master them!`,
    });

    // Show a welcome message
    updateMascot('excited', `¡Hola! Ready to learn some Spanish ${category.name.toLowerCase()}?`, true);
    
    // Save this as the last accessed lesson
    localStorage.setItem('lastLesson', categoryId);
    
    // Track lesson progress
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    if (!completedLessons.includes(categoryId)) {
      localStorage.setItem('currentLesson', categoryId);
    }
  };

  const updateProgress = () => {
    let progressValue = 0;
    
    switch (currentStep) {
      case 'intro':
        progressValue = 5;
        break;
      case 'vocabulary':
        progressValue = 5 + ((currentVocabIndex / (lessonContent?.vocabulary.length || 1)) * 40);
        break;
      case 'practice':
        progressValue = 45 + ((currentQuestionIndex / (lessonContent?.questions.length || 1)) * 50);
        break;
      case 'summary':
        progressValue = 100;
        break;
    }
    
    setProgress(Math.round(progressValue));
  };
  
  const updateMascot = (emotion: 'happy' | 'excited' | 'thinking' | 'sad' | 'sleeping' | 'neutral', message: string, show: boolean) => {
    setMascotEmotion(emotion);
    setMascotMessage(message);
    setShowMascotMessage(show);
    
    if (show) {
      // Hide message after 5 seconds
      setTimeout(() => {
        setShowMascotMessage(false);
      }, 5000);
    }
  };
  
  const handleNextStep = () => {
    switch (currentStep) {
      case 'intro':
        setCurrentStep('vocabulary');
        updateMascot('happy', '¡Excelente! Let\'s learn new words!', true);
        break;
      case 'vocabulary':
        if (currentVocabIndex < (lessonContent?.vocabulary.length || 0) - 1) {
          setCurrentVocabIndex(currentVocabIndex + 1);
        } else {
          setCurrentStep('practice');
          setCurrentVocabIndex(0);
          updateMascot('excited', '¡Genial! Now let\'s practice!', true);
        }
        break;
      case 'practice':
        if (showExplanation) {
          setShowExplanation(false);
          setSelectedAnswer(null);
          
          if (currentQuestionIndex < (lessonContent?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            setCurrentStep('summary');
            
            // Mark lesson as completed
            const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
            if (!completedLessons.includes(selectedCategory)) {
              completedLessons.push(selectedCategory);
              localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
            }
            
            // Save earned XP
            const currentXP = parseInt(localStorage.getItem('xpPoints') || '0');
            const newXP = currentXP + xpEarned;
            localStorage.setItem('xpPoints', newXP.toString());
            
            // Show congratulations
            updateMascot('excited', `¡Fantástico! You earned ${xpEarned} XP!`, true);
          }
        } else {
          handleAnswerSubmit();
        }
        break;
      case 'summary':
        navigate('/learning-path');
        break;
    }
  };
  
  const handlePrevStep = () => {
    switch (currentStep) {
      case 'vocabulary':
        if (currentVocabIndex > 0) {
          setCurrentVocabIndex(currentVocabIndex - 1);
        } else {
          setCurrentStep('intro');
        }
        break;
      case 'practice':
        if (showExplanation) {
          setShowExplanation(false);
          setSelectedAnswer(null);
        } else if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
          setSelectedAnswer(null);
        } else {
          setCurrentStep('vocabulary');
          setCurrentVocabIndex(lessonContent?.vocabulary.length ? lessonContent.vocabulary.length - 1 : 0);
        }
        break;
      case 'summary':
        setCurrentStep('practice');
        setCurrentQuestionIndex(lessonContent?.questions.length ? lessonContent.questions.length - 1 : 0);
        break;
    }
  };
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !lessonContent) return;
    
    const currentQuestion = lessonContent.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Award XP based on correctness
    const pointsEarned = isCorrect ? 10 : 0;
    setXpEarned(prevXP => prevXP + pointsEarned);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      updateMascot('happy', '¡Correcto! Great job!', true);
      
      // Play sound effect for correct answer
      playSoundEffect('correct');
    } else {
      updateMascot('thinking', 'Not quite right, but you\'re learning!', true);
    }
    
    setShowExplanation(true);
  };

  const handlePlayAudio = async (text: string) => {
    if (isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    
    try {
      // Use Web Speech API for text-to-speech
      await playAudio(text, {
        languageCode: 'es',  // Use Spanish language
        rate: 0.85,          // Slightly slower rate for learning
        volume: 1.0,         // Full volume 
        cacheKey: `spanish_${text}`, // Cache with language prefix
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Audio Error",
        description: "Failed to play pronunciation",
        variant: "destructive"
      });
    } finally {
      setIsPlayingAudio(false);
    }
  };
  
  const handleBack = () => {
    navigate('/lessons');
  };

  const renderVocabularySection = () => {
    if (currentStep !== 'vocabulary' || !lessonContent?.vocabulary[currentVocabIndex]) {
      return null;
    }
    
    const currentVocab = lessonContent.vocabulary[currentVocabIndex];
    
    return (
      <motion.div 
        key={`vocab-${currentVocabIndex}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <h3 className="text-xl text-spanish-teal mb-2">New Word ({currentVocabIndex + 1}/{lessonContent.vocabulary.length})</h3>
        
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-6 my-8 border-2 border-spanish-teal">
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-4xl font-bold text-spanish-teal">
              {currentVocab.word}
            </h2>
            
            <SpeechControls 
              text={currentVocab.word} 
              language="es"
            />
            
            <div className="w-full border-t border-gray-200 my-2"></div>
            
            <div className="text-2xl text-gray-700">
              {currentVocab.translation}
            </div>
            
            <Card className="w-full bg-spanish-lightTeal border-0">
              <CardContent className="p-4">
                <p className="text-center text-spanish-darkteal mb-2">
                  Practice using this word:
                </p>
                <p className="text-center font-medium">
                  {currentVocab.exampleSentence}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          {lessonContent.vocabulary.map((_, i) => (
            <div 
              key={`dot-${i}`} 
              className={`w-2 h-2 rounded-full ${i === currentVocabIndex ? 'bg-spanish-teal' : 'bg-gray-200'}`}
            ></div>
          ))}
        </div>
      </motion.div>
    );
  };

  if (!lessonContent) return <div className="flex justify-center items-center h-screen">Loading lesson...</div>;

  // Get the current category
  const category = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2"
            onClick={handleBack}
          >
            <ArrowLeft size={18} /> Back to Lessons
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-spanish-yellow text-gray-800 px-3 py-1 rounded-full">
              <Star className="text-spanish-orange" size={18} />
              <span className="font-bold">{parseInt(localStorage.getItem('xpPoints') || '0')} XP</span>
            </div>
            
            <div className="flex items-center gap-2 bg-spanish-teal text-white px-3 py-1 rounded-full">
              <Trophy size={18} />
              <span className="font-bold">Lesson {currentQuestionIndex + 1}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 relative overflow-hidden">
          <motion.div 
            className="bg-spanish-teal h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with fox mascot and info */}
          <div className="md:w-1/4">
            <div className="sticky top-20">
              <Card className="bg-gradient-to-b from-white to-sky-50 border-0 shadow-md overflow-hidden mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-center my-4">
                    <FoxMascot 
                      emotion={mascotEmotion} 
                      message={mascotMessage}
                      showMessage={showMascotMessage}
                      size="lg"
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-spanish-teal mt-4 text-center">
                    {category?.name} Lesson
                  </h3>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${currentStep === 'intro' ? 'bg-spanish-teal' : 'bg-gray-200'}`}></div>
                      <p className={`text-sm ${currentStep === 'intro' ? 'font-bold text-spanish-teal' : 'text-gray-500'}`}>Introduction</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${currentStep === 'vocabulary' ? 'bg-spanish-teal' : currentStep === 'intro' ? 'bg-gray-200' : 'bg-spanish-lightTeal'}`}></div>
                      <p className={`text-sm ${currentStep === 'vocabulary' ? 'font-bold text-spanish-teal' : currentStep === 'intro' ? 'text-gray-500' : 'text-spanish-teal'}`}>Vocabulary</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${currentStep === 'practice' ? 'bg-spanish-teal' : currentStep === 'intro' || currentStep === 'vocabulary' ? 'bg-gray-200' : 'bg-spanish-lightTeal'}`}></div>
                      <p className={`text-sm ${currentStep === 'practice' ? 'font-bold text-spanish-teal' : currentStep === 'intro' || currentStep === 'vocabulary' ? 'text-gray-500' : 'text-spanish-teal'}`}>Practice</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${currentStep === 'summary' ? 'bg-spanish-teal' : 'bg-gray-200'}`}></div>
                      <p className={`text-sm ${currentStep === 'summary' ? 'font-bold text-spanish-teal' : 'text-gray-500'}`}>Summary</p>
                    </div>
                  </div>
                  
                  {/* Stats (shown when in practice or summary) */}
                  {(currentStep === 'practice' || currentStep === 'summary') && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">Session Stats</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">XP Earned</span>
                          <span className="text-xs font-bold text-spanish-orange">{xpEarned}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Correct Answers</span>
                          <span className="text-xs font-bold text-spanish-teal">
                            {correctAnswers}/{currentStep === 'summary' ? lessonContent?.questions.length : currentQuestionIndex + 1}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Accuracy</span>
                          <span className="text-xs font-bold text-spanish-teal">
                            {currentQuestionIndex > 0 || currentStep === 'summary' 
                              ? `${Math.round((correctAnswers / (currentStep === 'summary' ? lessonContent?.questions.length : currentQuestionIndex + 1)) * 100)}%`
                              : '0%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="md:w-3/4">
            <Card className="border-0 shadow-lg overflow-hidden mb-6 min-h-[400px]">
              <CardContent className="p-8">
                {/* Introduction */}
                {currentStep === 'intro' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="text-6xl bg-spanish-lightTeal p-4 rounded-full">
                        {category?.icon}
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-spanish-teal text-center mb-4">
                      {category?.name} in Spanish
                    </h2>
                    
                    <p className="text-lg text-center mb-6">{lessonContent.introduction}</p>
                    
                    <ul className="grid grid-cols-2 gap-3">
                      {lessonContent.vocabulary.slice(0, 4).map((vocab, index) => (
                        <li key={index} className="flex items-center gap-2 bg-spanish-lightTeal rounded-lg p-3">
                          <span className="text-spanish-teal font-bold">{vocab.word}</span>
                          <span className="text-gray-500 text-sm">({vocab.translation})</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                
                {/* Vocabulary */}
                {renderVocabularySection()}
                
                {/* Practice Questions */}
                {currentStep === 'practice' && lessonContent.questions[currentQuestionIndex] && (
                  <motion.div 
                    key={`question-${currentQuestionIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-spanish-teal">Question {currentQuestionIndex + 1}/{lessonContent.questions.length}</h3>
                      <span className="bg-spanish-lightTeal text-spanish-teal px-3 py-1 rounded-full text-sm">
                        {showExplanation ? (selectedAnswer === lessonContent.questions[currentQuestionIndex].correctAnswer ? '¡Correcto!' : 'Incorrect') : '?'}
                      </span>
                    </div>
                    
                    <Card className="border-0 bg-white shadow">
                      <CardContent className="p-6">
                        <h4 className="text-xl font-medium mb-6">{lessonContent.questions[currentQuestionIndex].question}</h4>
                        
                        {/* If question contains Spanish words, add speech controls */}
                        {/[áéíóúñ¿¡]/i.test(lessonContent.questions[currentQuestionIndex].question) && (
                          <div className="mb-6">
                            <SpeechControls 
                              text={lessonContent.questions[currentQuestionIndex].question}
                              language="es"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          {lessonContent.questions[currentQuestionIndex].options.map((option, i) => (
                            <motion.button
                              key={`option-${i}`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                !showExplanation
                                  ? selectedAnswer === option
                                    ? 'border-spanish-teal bg-spanish-lightTeal'
                                    : 'border-gray-200 hover:border-gray-300'
                                  : option === lessonContent.questions[currentQuestionIndex].correctAnswer
                                    ? 'border-green-500 bg-green-50'
                                    : selectedAnswer === option && option !== lessonContent.questions[currentQuestionIndex].correctAnswer
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-200'
                              }`}
                              onClick={() => !showExplanation && handleAnswerSelect(option)}
                              disabled={showExplanation}
                            >
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                                  !showExplanation
                                    ? selectedAnswer === option
                                      ? 'bg-spanish-teal text-white'
                                      : 'bg-gray-100 text-gray-500'
                                    : option === lessonContent.questions[currentQuestionIndex].correctAnswer
                                      ? 'bg-green-500 text-white'
                                      : selectedAnswer === option && option !== lessonContent.questions[currentQuestionIndex].correctAnswer
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {showExplanation && option === lessonContent.questions[currentQuestionIndex].correctAnswer ? (
                                    <CheckCircle2 size={16} />
                                  ) : (
                                    <span className="text-xs">{String.fromCharCode(65 + i)}</span>
                                  )}
                                </div>
                                {option}
                                
                                {/* Add speech button for Spanish options */}
                                {/[áéíóúñ¿¡]/i.test(option) && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="ml-auto h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handlePlayAudio(option);
                                    }}
                                  >
                                    {isPlayingAudio ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                                  </Button>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Explanation area shown after answer */}
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`rounded-lg p-4 ${
                          selectedAnswer === lessonContent.questions[currentQuestionIndex].correctAnswer
                            ? 'bg-green-50 border-l-4 border-green-500'
                            : 'bg-orange-50 border-l-4 border-orange-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <HelpCircle size={20} className={selectedAnswer === lessonContent.questions[currentQuestionIndex].correctAnswer ? 'text-green-500' : 'text-orange-500'} />
                          </div>
                          <div>
                            <h5 className={`font-bold ${selectedAnswer === lessonContent.questions[currentQuestionIndex].correctAnswer ? 'text-green-700' : 'text-orange-700'}`}>
                              {selectedAnswer === lessonContent.questions[currentQuestionIndex].correctAnswer ? '¡Excelente!' : 'Let\'s learn from this'}
                            </h5>
                            <p className="mt-1">{lessonContent.questions[currentQuestionIndex].explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
                
                {/* Summary */}
                {currentStep === 'summary' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="inline-block bg-yellow-100 rounded-full p-8 mb-6">
                      <Trophy className="h-20 w-20 text-spanish-orange" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-spanish-teal mb-4">¡Fantástico!</h2>
                    
                    <p className="text-xl mb-8">{lessonContent.summary}</p>
                    
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                      <h3 className="text-xl font-bold text-spanish-teal mb-4">Lesson Results</h3>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-spanish-lightTeal rounded-lg p-4">
                          <p className="text-sm text-gray-600">Words Learned</p>
                          <p className="text-2xl font-bold text-spanish-teal">{lessonContent.vocabulary.length}</p>
                        </div>
                        
                        <div className="bg-spanish-lightTeal rounded-lg p-4">
                          <p className="text-sm text-gray-600">XP Earned</p>
                          <p className="text-2xl font-bold text-spanish-orange">{xpEarned}</p>
                        </div>
                        
                        <div className="bg-spanish-lightTeal rounded-lg p-4">
                          <p className="text-sm text-gray-600">Accuracy</p>
                          <p className="text-2xl font-bold text-spanish-teal">
                            {Math.round((correctAnswers / lessonContent.questions.length) * 100)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-spanish-lightTeal rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen size={16} className="text-spanish-teal" />
                          <h4 className="font-bold text-spanish-teal">Key Words You Learned</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {lessonContent.vocabulary.slice(0, 8).map((vocab, i) => (
                            <div key={`summary-vocab-${i}`} className="bg-white rounded p-2 text-sm">
                              <p className="font-bold">{vocab.word}</p>
                              <p className="text-xs text-gray-500">{vocab.translation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-spanish-lightTeal to-sky-100 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-spanish-teal" />
                          <h4 className="font-bold text-spanish-teal">Next Steps</h4>
                        </div>
                        
                        <p className="text-sm mt-1">Continue your learning journey with more lessons or review what you've learned.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handlePrevStep}
                disabled={currentStep === 'intro'}
              >
                <ArrowLeft size={16} /> Back
              </Button>
              
              <Button 
                className={`flex items-center gap-2 ${
                  showExplanation && currentStep === 'practice'
                    ? 'bg-spanish-orange hover:bg-spanish-darkorange' 
                    : 'bg-spanish-teal hover:bg-spanish-darkteal'
                }`}
                onClick={handleNextStep}
                disabled={currentStep === 'practice' && !showExplanation && !selectedAnswer}
              >
                {currentStep === 'practice' && !showExplanation ? 'Check Answer' : currentStep === 'summary' ? 'Finish Lesson' : 'Next'} 
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseLesson;
