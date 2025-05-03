
import { Progress } from "@/components/ui/progress";
import { Trophy, Layers, Award, Star, Flame, Sparkles, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DifficultyLevel, 
  LearningStyle, 
  AIPersonalizationSettings, 
  getPersonalizedEncouragementMessage 
} from "@/utils/aiPersonalization";

interface SessionProgressProps {
  newCards: number;
  reviewCards: number;
  cardsCompleted: number;
  totalCards: number;
  streak: number;
  userLevel: number;
}

const SessionProgress = ({ 
  newCards, 
  reviewCards, 
  cardsCompleted, 
  totalCards,
  streak,
  userLevel
}: SessionProgressProps) => {
  const progressPercentage = totalCards > 0 ? (cardsCompleted / totalCards) * 100 : 0;
  // Calculate XP for this session
  const sessionXP = cardsCompleted * 10;
  
  // Mock AI personalization data - in a real app this would come from an AI engine
  const [showAIInsights, setShowAIInsights] = useState(false);
  const mockPerformance = {
    correctAnswers: cardsCompleted * 0.8,
    incorrectAnswers: cardsCompleted * 0.2,
    averageResponseTime: 3.2,
    streakDays: streak,
    completedCategories: ['basics', 'greetings', 'food'],
    masteredWords: Array(cardsCompleted).fill('').map((_, i) => `word${i}`)
  };
  
  const aiSettings: AIPersonalizationSettings = {
    preferredLearningStyle: 'visual' as LearningStyle,
    recommendedDifficultyLevel: 'medium' as DifficultyLevel,
    focusAreas: ['verbs', 'common phrases'],
    optimizedReviewInterval: 24 + streak,
    personalizedSessionLength: 5 + Math.min(streak/2, 10)
  };
  
  const encouragementMessage = getPersonalizedEncouragementMessage(mockPerformance);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-800">Session Progress</h3>
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs"
          >
            <Flame className="h-3.5 w-3.5 mr-1 text-orange-500" />
            <span className="font-semibold">{streak}</span>
            <span className="ml-1">day streak</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
          >
            <Award className="h-3.5 w-3.5 mr-1 text-spanish-teal" />
            <span className="font-semibold">Level {userLevel}</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs"
          >
            <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
            <span className="font-semibold">{sessionXP}</span>
            <span className="ml-1">XP</span>
          </motion.div>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-2 bg-gray-100" />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{cardsCompleted} of {totalCards} cards completed</span>
        <div className="flex gap-3">
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-spanish-teal mr-1"></span>
            New: {newCards}
          </span>
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            Review: {reviewCards}
          </span>
        </div>
      </div>
      
      {/* AI Personalization Insights Button */}
      <div className="mt-2 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-600"
        >
          {cardsCompleted === totalCards ? 
            "¡Excelente! You've completed all cards!" : 
            `Great progress! Keep going to earn ${(totalCards - cardsCompleted) * 10} more XP!`
          }
        </motion.div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-xs text-ai-primary hover:text-ai-accent hover:bg-ai-background"
          onClick={() => setShowAIInsights(!showAIInsights)}
        >
          <Sparkles className="h-3 w-3 mr-1 text-ai-primary" />
          AI Insights
        </Button>
      </div>
      
      {/* AI Personalized Recommendations */}
      {showAIInsights && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-gray-100"
        >
          <div className="flex items-center mb-2">
            <Brain className="h-4 w-4 mr-2 text-ai-accent" />
            <h4 className="text-sm font-medium text-gray-700">AI-Personalized Learning Path</h4>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="bg-ai-background rounded-md p-2">
              <p className="text-gray-700 mb-1">{encouragementMessage}</p>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ai-secondary mr-1"></span>
                  <span className="text-gray-600">Learning style: </span>
                  <span className="font-medium ml-1">{aiSettings.preferredLearningStyle}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ai-accent mr-1"></span>
                  <span className="text-gray-600">Optimal difficulty: </span>
                  <span className="font-medium ml-1">{aiSettings.recommendedDifficultyLevel}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ai-highlight mr-1"></span>
                  <span className="text-gray-600">Review in: </span>
                  <span className="font-medium ml-1">{aiSettings.optimizedReviewInterval}h</span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-ai-primary mr-1"></span>
                  <span className="text-gray-600">Session length: </span>
                  <span className="font-medium ml-1">{aiSettings.personalizedSessionLength} min</span>
                </div>
              </div>
              
              <div className="mt-2">
                <span className="text-gray-600">Focus on: </span>
                {aiSettings.focusAreas.map((area, index) => (
                  <span key={index} className="inline-block bg-white px-1.5 py-0.5 rounded text-ai-primary font-medium mr-1">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SessionProgress;
