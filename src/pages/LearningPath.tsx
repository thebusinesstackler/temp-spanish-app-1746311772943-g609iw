
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Trophy, Star, Award, Check, Lock, Calendar, Bell, Book, Mic } from "lucide-react";
import { motion } from "framer-motion";
import FoxMascot from "@/components/FoxMascot";
import { Progress } from "@/components/ui/progress";
import { categories } from '@/data/flashcards';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Define level types
interface LevelItem {
  level: number;
  title: string;
  description: string;
  xpToUnlock: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
}

interface DailyGoalData {
  goalType: string;
  currentProgress: number;
  targetValue: number;
  icon: JSX.Element;
}

const LearningPath = () => {
  const navigate = useNavigate();
  const [xp, setXp] = useState(500); // Increased XP points to unlock all levels
  const [streak, setStreak] = useState(5); // Current streak days
  const [foxMessage, setFoxMessage] = useState('');
  const [showFoxMessage, setShowFoxMessage] = useState(false);
  const [language, setLanguage] = useState<string>("Spanish");
  
  // Learning path data - updated progress values and completion status
  const [levels, setLevels] = useState<LevelItem[]>([
    {
      level: 1,
      title: "Basics",
      description: "Common words & simple phrases",
      xpToUnlock: 0,
      isUnlocked: true,
      isCompleted: true, // First level completed
      progress: 100
    },
    {
      level: 2,
      title: "Greetings & Introductions",
      description: "Learn to introduce yourself and greet others",
      xpToUnlock: 150,
      isUnlocked: true,
      isCompleted: true, // Second level completed
      progress: 100
    },
    {
      level: 3,
      title: "Food & Dining",
      description: "Ordering food and talking about meals",
      xpToUnlock: 300,
      isUnlocked: true,
      isCompleted: false, // User is working on this level
      progress: 75
    },
    {
      level: 4,
      title: "Travel Essentials",
      description: "Key phrases for navigating new places",
      xpToUnlock: 500,
      isUnlocked: true, // Unlocked with higher initial XP
      isCompleted: false,
      progress: 10
    }
  ]);

  // Daily goals data - updated to show more progress
  const [dailyGoals, setDailyGoals] = useState<DailyGoalData[]>([
    {
      goalType: "XP Goal",
      currentProgress: 45, // Increased progress
      targetValue: 50,
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      goalType: "Lessons",
      currentProgress: 2, // Increased progress
      targetValue: 3,
      icon: <Book className="w-5 h-5 text-spanish-teal" />
    },
    {
      goalType: "Practice Minutes",
      currentProgress: 12, // Increased progress
      targetValue: 15,
      icon: <Calendar className="w-5 h-5 text-spanish-purple" />
    }
  ]);

  // Get stored language
  useEffect(() => {
    const storedLanguage = localStorage.getItem('learningLanguage');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // Handle starting the basic level
  const handleStartLevel = (level: LevelItem) => {
    if (!level.isUnlocked) {
      handleLockedLevelClick(level);
      return;
    }
    
    // Set the selected category based on level
    let categoryToSelect = '';
    
    switch(level.level) {
      case 1: 
        categoryToSelect = 'basics';
        break;
      case 2:
        categoryToSelect = 'greetings';
        break;
      case 3:
        categoryToSelect = 'food';
        break;
      case 4:
        categoryToSelect = 'travel';
        break;
      default:
        categoryToSelect = 'basics';
    }
    
    localStorage.setItem('selectedCategory', categoryToSelect);
    navigate('/lessons');
  };

  // Complete level functionality - NEW
  const handleCompleteLevel = (level: LevelItem) => {
    // Mark level as completed and increase XP
    setLevels(prev => prev.map(lvl => 
      lvl.level === level.level 
        ? { ...lvl, isCompleted: true, progress: 100 } 
        : lvl
    ));
    
    // Award XP for completing the level
    const xpReward = level.level * 50;
    setXp(prev => prev + xpReward);
    
    toast.success(`Congratulations! You completed ${level.title} and earned ${xpReward} XP!`);
    
    // Show fox message
    setFoxMessage(`¡Excelente! You've mastered ${level.title}. Keep going!`);
    setShowFoxMessage(true);
  };

  // Navigate to lessons page
  const handleViewLessons = () => {
    navigate('/lessons');
  };

  // Show fox message with welcome message on load
  useEffect(() => {
    setTimeout(() => {
      setFoxMessage("¡Hola! All levels are available for you to explore!");
      setShowFoxMessage(true);
    }, 1000);
  }, []);

  // Update level unlock status based on XP - now all levels are unlocked
  useEffect(() => {
    setLevels(prev => prev.map(level => ({
      ...level,
      isUnlocked: true // All levels unlocked
    })));
  }, [xp]);

  // Show a different message when user clicks on a locked level
  const handleLockedLevelClick = (level: LevelItem) => {
    setFoxMessage(`You need ${level.xpToUnlock - xp} more XP to unlock this level!`);
    setShowFoxMessage(true);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    localStorage.setItem('selectedCategory', categoryId);
    navigate('/lessons');
    toast.info(`Ready to learn ${categoryId} words & phrases!`);
  };

  // Progress to next level
  const handleProgressToNext = (currentLevelIndex: number) => {
    if (currentLevelIndex < levels.length - 1) {
      const nextLevel = levels[currentLevelIndex + 1];
      toast.info(`Moving to ${nextLevel.title}!`);
      handleStartLevel(nextLevel);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9f8]">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 lg:mb-0 text-center lg:text-left">
            Spanish Learning Dashboard
          </h1>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="bg-white rounded-full px-4 sm:px-6 hover:bg-gray-100"
              onClick={() => {}}
            >
              Log in
            </Button>
            <Button
              className="bg-spanish-teal text-white rounded-full px-4 sm:px-6 hover:bg-spanish-darkteal"
              onClick={() => navigate('/lessons')}
            >
              Start Lesson
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left column - Stats and Goals */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Fox Mascot Card */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-blue-50">
              <div className="flex flex-col items-center">
                <FoxMascot 
                  emotion="happy" 
                  size="lg" 
                  message={foxMessage}
                  showMessage={showFoxMessage}
                  onMessageClose={() => setShowFoxMessage(false)}
                />
                
                <div className="mt-4 sm:mt-6 text-center">
                  <h3 className="text-xl font-bold">¡Bienvenido!</h3>
                  <p className="text-gray-600">All paths are now available for you!</p>
                </div>
              </div>
            </Card>
            
            {/* Stats Card */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-spanish-gold" />
                Your Progress
              </h3>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center bg-white rounded-xl shadow-sm p-2 sm:p-3"
                >
                  <div className="text-spanish-teal text-base sm:text-lg font-bold">{xp}</div>
                  <div className="text-gray-500 text-xs">XP Points</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center bg-white rounded-xl shadow-sm p-2 sm:p-3"
                >
                  <div className="flex items-center text-orange-500 font-bold text-base sm:text-lg">
                    <div>{streak}</div>
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                  </div>
                  <div className="text-gray-500 text-xs">Day Streak</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center bg-white rounded-xl shadow-sm p-2 sm:p-3"
                >
                  <div className="text-spanish-purple text-base sm:text-lg font-bold">3</div>
                  <div className="text-gray-500 text-xs">Level</div>
                </motion.div>
              </div>
              
              {/* Proficiency chart - updated progress */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs sm:text-sm text-gray-600">Proficiency</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Intermediate</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-spanish-teal to-spanish-purple" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              {/* Practice streak */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs sm:text-sm text-gray-600">Weekly Activity</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">5/7 days</span>
                </div>
                <div className="flex justify-between">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div 
                      key={idx} 
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs 
                        ${idx < 5 ? 'bg-spanish-teal text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            {/* Daily Goals Card */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-amber-50 border-amber-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="mr-2 h-5 w-5 text-spanish-gold" />
                Daily Goals
              </h3>
              
              {dailyGoals.map((goal, index) => (
                <div key={index} className="mb-3 sm:mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      {goal.icon}
                      <span className="text-xs sm:text-sm text-gray-600 ml-2">{goal.goalType}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600">
                      {goal.currentProgress}/{goal.targetValue}
                    </span>
                  </div>
                  <Progress 
                    value={(goal.currentProgress / goal.targetValue) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
              
              <Button
                className="w-full mt-4 bg-spanish-gold hover:bg-amber-500 text-white"
                onClick={() => {
                  toast.success("Daily goals completed! +50 XP");
                  setXp(prev => prev + 50);
                }}
              >
                Complete Daily Goals
              </Button>
            </Card>
          </div>
          
          {/* Right column - Learning Path and Categories */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Learning Path Card */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-teal-50 border-teal-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-spanish-teal" />
                Your Learning Path
              </h3>
              
              <div className="relative pb-6">
                {levels.map((level, index) => {
                  // Determine if there's a previous level to connect to
                  const hasPreviousLevel = index > 0;
                  
                  // Determine status for styling
                  const isActive = level.isUnlocked && !level.isCompleted;
                  
                  return (
                    <div key={level.level} className="relative mb-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div 
                          className={`p-4 rounded-lg cursor-pointer hover:shadow-md transition-all
                            ${level.isCompleted 
                              ? 'bg-spanish-lightTeal bg-opacity-20 border border-spanish-lightTeal' 
                              : (level.isUnlocked 
                                  ? 'bg-white border border-spanish-teal border-opacity-30' 
                                  : 'bg-gray-100 border border-gray-200')
                            }
                          `}
                          onClick={() => handleStartLevel(level)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mr-4
                                ${level.isCompleted 
                                  ? 'bg-spanish-lightTeal text-spanish-darkteal' 
                                  : (level.isUnlocked 
                                      ? 'bg-spanish-teal text-white' 
                                      : 'bg-gray-300 text-gray-500')
                                }
                              `}>
                                {level.isCompleted ? <Check className="w-5 h-5" /> : level.level}
                              </div>
                              <div>
                                <h4 className={`text-lg font-semibold ${!level.isUnlocked ? 'text-gray-500' : ''}`}>
                                  {level.title}
                                </h4>
                                <p className={`text-sm ${!level.isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {level.description}
                                </p>
                                
                                {/* Progress bar for the level */}
                                {level.isUnlocked && level.progress > 0 && level.progress < 100 && (
                                  <div className="mt-2 w-full max-w-[200px]">
                                    <Progress value={level.progress} className="h-1.5" />
                                    <div className="text-xs text-gray-500 mt-1">{level.progress}% complete</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              {/* Add "Complete" button if level is in progress */}
                              {level.isUnlocked && !level.isCompleted && level.progress > 0 && (
                                <Button 
                                  size="sm"
                                  className="bg-spanish-gold hover:bg-amber-500 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteLevel(level);
                                  }}
                                >
                                  <span className="flex items-center">
                                    Complete <Check className="ml-1 h-4 w-4" />
                                  </span>
                                </Button>
                              )}
                              
                              <Button 
                                size="sm"
                                className={`
                                  ${level.isCompleted 
                                    ? 'bg-spanish-lightTeal text-spanish-darkteal hover:bg-spanish-lightTeal/80' 
                                    : (level.isUnlocked 
                                        ? 'bg-spanish-teal hover:bg-spanish-darkteal text-white' 
                                        : 'bg-gray-200 text-gray-400')
                                  }
                                `}
                                disabled={!level.isUnlocked}
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  handleStartLevel(level);
                                }}
                              >
                                {level.isCompleted ? (
                                  <span className="flex items-center">
                                    Practice <ChevronRight className="ml-1 h-4 w-4" />
                                  </span>
                                ) : level.isUnlocked ? (
                                  <span className="flex items-center">
                                    Start <ChevronRight className="ml-1 h-4 w-4" />
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <Lock className="mr-1 h-4 w-4" /> {level.xpToUnlock} XP
                                  </span>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Add "Continue to next" button for completed levels */}
                      {level.isCompleted && index < levels.length - 1 && !levels[index + 1].isCompleted && (
                        <div className="ml-14 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center text-spanish-purple border-spanish-purple hover:bg-spanish-purple/10"
                            onClick={() => handleProgressToNext(index)}
                          >
                            Continue to {levels[index + 1].title} <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {/* Add connecting line between levels */}
                      {index < levels.length - 1 && (
                        <div className="absolute left-5 top-14 bottom-0 w-0.5 bg-gray-200 h-8"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
            
            {/* Categories Card */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-blue-50 border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Book className="mr-2 h-5 w-5 text-spanish-purple" />
                  Learning Categories
                </h3>
                
                <Button 
                  variant="ghost" 
                  className="text-spanish-teal hover:text-spanish-darkteal hover:bg-teal-50"
                  onClick={handleViewLessons}
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {categories.slice(0, 5).map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.03 }}
                    className="cursor-pointer"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div 
                      className="p-3 sm:p-4 rounded-lg h-full flex flex-col items-center justify-center text-center"
                      style={{
                        background: `linear-gradient(135deg, ${category.gradient.from}, ${category.gradient.to})`,
                      }}
                    >
                      <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-800">{category.name}</h4>
                    </div>
                  </motion.div>
                ))}
                
                {/* New Conversation AI Category */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="cursor-pointer"
                  onClick={() => navigate('/conversation-ai')}
                >
                  <div 
                    className="p-3 sm:p-4 rounded-lg h-full flex flex-col items-center justify-center text-center relative"
                    style={{
                      background: `linear-gradient(135deg, #8B5CF6, #6366F1)`,
                    }}
                  >
                    <div className="absolute -top-1 -right-1">
                      <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 border-none">New</Badge>
                    </div>
                    <div className="text-2xl sm:text-3xl mb-2 text-white">
                      <Mic />
                    </div>
                    <h4 className="text-xs sm:text-sm font-medium text-white">Conversation AI</h4>
                  </div>
                </motion.div>
              </div>
              
              {/* Conversation AI Feature Description */}
              <div className="mt-4 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex flex-col sm:flex-row items-start">
                  <Mic className="text-purple-700 mr-0 sm:mr-3 mb-2 sm:mb-0 sm:mt-1" />
                  <div>
                    <h4 className="font-semibold text-purple-900 flex items-center flex-wrap">
                      Conversation AI Practice 
                      <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 border-none">New</Badge>
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Practice real Spanish conversations with our AI assistant. Record your voice, get instant transcriptions, and save recordings to track your progress.
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-xs text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 inline-block"></span>
                        Record and play back your Spanish speaking practice
                      </li>
                      <li className="text-xs text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 inline-block"></span>
                        Get accurate transcriptions and translations
                      </li>
                      <li className="text-xs text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 inline-block"></span>
                        Save your recordings to track improvement over time
                      </li>
                    </ul>
                    <Button 
                      size="sm"
                      className="mt-3 bg-purple-700 hover:bg-purple-800 text-white"
                      onClick={() => navigate('/conversation-ai')}
                    >
                      Try Conversation AI <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Upcoming Features Card */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="mr-2 h-5 w-5 text-spanish-purple" />
                Coming Soon
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white rounded-lg border border-dashed border-gray-300">
                  <h4 className="font-medium mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-spanish-purple mr-2"></span>
                    Conversation Practice
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">Practice speaking Spanish with our AI conversation partner</p>
                </div>
                
                <div className="p-3 sm:p-4 bg-white rounded-lg border border-dashed border-gray-300">
                  <h4 className="font-medium mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-spanish-orange mr-2"></span>
                    Cultural Insights
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">Learn about Spanish culture and traditions</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0">
        <div className="h-1 bg-gray-200">
          <div className="h-1 bg-spanish-teal w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
