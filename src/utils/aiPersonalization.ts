
import { Flashcard } from "@/data/flashcards";

// Difficulty levels for adaptive learning
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'challenging';

// Learning styles for personalization
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';

// User performance metrics
export interface UserPerformance {
  correctAnswers: number;
  incorrectAnswers: number;
  averageResponseTime: number;
  streakDays: number;
  completedCategories: string[];
  masteredWords: string[];
}

// AI personalization settings
export interface AIPersonalizationSettings {
  preferredLearningStyle: LearningStyle;
  recommendedDifficultyLevel: DifficultyLevel;
  focusAreas: string[];
  optimizedReviewInterval: number; // In hours
  personalizedSessionLength: number; // In minutes
}

// Mock AI personalization engine - in a real app, this would use machine learning
export const calculatePersonalizedSettings = (performance: UserPerformance): AIPersonalizationSettings => {
  // This is a simplified simulation of an AI recommendation engine
  
  // Determine recommended difficulty based on success rate
  const totalAnswers = performance.correctAnswers + performance.incorrectAnswers;
  const successRate = totalAnswers > 0 ? performance.correctAnswers / totalAnswers : 0;
  
  let recommendedDifficultyLevel: DifficultyLevel = 'medium';
  if (successRate > 0.85) recommendedDifficultyLevel = 'challenging';
  else if (successRate > 0.7) recommendedDifficultyLevel = 'hard';
  else if (successRate < 0.5) recommendedDifficultyLevel = 'easy';
  
  // Determine learning style (in a real app would be more sophisticated)
  // For this demo, we'll just randomly assign a learning style
  const learningStyles: LearningStyle[] = ['visual', 'auditory', 'kinesthetic', 'reading/writing'];
  const preferredLearningStyle = learningStyles[Math.floor(Math.random() * learningStyles.length)];
  
  // Determine focus areas based on error patterns (simplified)
  const focusAreas = performance.completedCategories.length > 0 
    ? [performance.completedCategories[Math.floor(Math.random() * performance.completedCategories.length)]]
    : ['basics'];
    
  // Calculate optimal review interval using a spaced repetition algorithm (simplified)
  // Longer streaks = longer optimal intervals between reviews
  const optimizedReviewInterval = Math.min(24 + (performance.streakDays * 2), 72);
  
  // Personalize session length based on user engagement patterns
  const personalizedSessionLength = 5 + Math.min(performance.streakDays / 2, 10);
  
  return {
    preferredLearningStyle,
    recommendedDifficultyLevel,
    focusAreas,
    optimizedReviewInterval,
    personalizedSessionLength
  };
};

// Adaptive difficulty adjustment for flashcards
export const adaptFlashcardDifficulty = (
  flashcards: Flashcard[],
  performance: UserPerformance
): Flashcard[] => {
  const settings = calculatePersonalizedSettings(performance);
  
  // In a real AI system, this would use more sophisticated algorithms
  // Here we'll just do a simple sorting based on difficulty
  
  // First, we'll prioritize categories in the focus areas
  const prioritizedCards = flashcards.sort((a, b) => {
    // Prioritize cards from focus areas
    const aInFocus = settings.focusAreas.includes(a.category);
    const bInFocus = settings.focusAreas.includes(b.category);
    
    if (aInFocus && !bInFocus) return -1;
    if (!aInFocus && bInFocus) return 1;
    
    // Then sort by appropriate difficulty
    if (settings.recommendedDifficultyLevel === 'easy') {
      return (a.difficulty === 'beginner' ? -1 : 1);
    } else if (settings.recommendedDifficultyLevel === 'challenging') {
      return (a.difficulty === 'advanced' ? -1 : 1);
    }
    
    return 0;
  });
  
  return prioritizedCards;
};

// Function to get personalized encouragement messages
export const getPersonalizedEncouragementMessage = (performance: UserPerformance): string => {
  const messages = [
    "¡Fantástico! Your learning style is perfect for visual exercises.",
    "Great progress! AI suggests focusing on conversation practice next.",
    "You're doing well with vocabulary! Let's practice some grammar.",
    "Based on your progress, we recommend reviewing past lessons.",
    "Your pronunciation is improving! Keep practicing with speech exercises."
  ];
  
  // In a real app, this would use actual personalization
  return messages[Math.floor(Math.random() * messages.length)];
};
