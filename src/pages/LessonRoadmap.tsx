
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LessonRoadmap = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const navigate = useNavigate();

  // Module completion state (would normally be from localStorage or API)
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  
  const modules = [
    {
      id: 'basics',
      title: '¡Hola Mundo!',
      subtitle: 'Basics & Greetings',
      description: 'Learn fundamental greetings, basic introductions, essential courtesy phrases, and understand the concept of gendered nouns.',
      icon: '👋',
      activities: [
        'Mirror Talk: Practice greetings and introductions in front of a mirror',
        'Flashcard Fun: Create physical or digital flashcards for new words',
        'Role-Playing: Imagine meeting new friends and practice introductions'
      ],
      categories: ['Basics', 'Greetings & Introductions'],
      color: 'blue'
    },
    {
      id: 'food',
      title: '¡A Comer!',
      subtitle: 'Food & Drinks',
      description: 'Learn common food and drink vocabulary, simple phrases for ordering, and expressing likes/dislikes.',
      icon: '🍽️',
      activities: [
        'Label Your Kitchen: Stick labels on items in your kitchen with their Spanish names',
        'Menu Maker: Create a simple Spanish menu using the vocabulary learned',
        'Food Diary: For one day, try naming the foods you eat in Spanish'
      ],
      categories: ['Food & Dining'],
      color: 'green'
    },
    {
      id: 'numbers',
      title: 'Contando Historias',
      subtitle: 'Numbers & Time',
      description: 'Learn numbers 1-20, basic time-telling phrases, and days of the week.',
      icon: '🔢',
      activities: [
        'Number Hunt: Look for numbers around your house or outside and say them in Spanish',
        'Daily Schedule: Write a simple schedule for your day using Spanish times and days',
        'Counting Game: Count objects you see throughout the day in Spanish'
      ],
      categories: ['Numbers', 'Time'],
      color: 'amber'
    },
    {
      id: 'colors',
      title: 'El Mundo Colorido',
      subtitle: 'Colors & Animals',
      description: 'Learn basic colors and common animal names.',
      icon: '🎨',
      activities: [
        'I Spy: Play "I Spy" (Veo veo) using colors and objects around you',
        'Drawing Dictation: Describe a simple scene using colors and animals in Spanish',
        'Animal Sounds: Learn the sounds animals make in Spanish'
      ],
      categories: ['Colors', 'Animals'],
      color: 'red'
    },
    {
      id: 'family',
      title: 'Mi Gente y Mi Lugar',
      subtitle: 'Family & Places',
      description: 'Learn basic family vocabulary and names for common places.',
      icon: '👨‍👩‍👧‍👦',
      activities: [
        'Family Tree: Draw a simple family tree and label members in Spanish',
        'Map It Out: Draw a map of your neighborhood and label key places in Spanish',
        'Describe Your Room: Try describing your room using simple sentences and vocabulary'
      ],
      categories: ['Family', 'Places'],
      color: 'purple'
    },
    {
      id: 'weather',
      title: 'El Clima y El Viaje',
      subtitle: 'Weather & Travel',
      description: 'Learn basic weather phrases and essential travel vocabulary/phrases.',
      icon: '☔',
      activities: [
        'Weather Reporter: Look outside and report the weather in Spanish',
        'Travel Scenarios: Imagine asking for directions or help in Spanish',
        'Pack Your Bag: Name items you would pack for a trip in Spanish'
      ],
      categories: ['Weather', 'Travel Essentials'],
      color: 'sky'
    }
  ];

  const startModule = (moduleId: string) => {
    // Store the module categories in localStorage
    const module = modules.find(m => m.id === moduleId);
    if (module && module.categories.length > 0) {
      localStorage.setItem('selectedCategory', module.categories[0]);
    }
    // Navigate to flashcards page to start learning
    navigate('/flashcards');
  };

  const colorVariants: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    amber: 'bg-amber-100 text-amber-800 border-amber-300',
    red: 'bg-red-100 text-red-800 border-red-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    sky: 'bg-sky-100 text-sky-800 border-sky-300'
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Lesson One: Spanish Foundations</h1>
      
      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Lesson One!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Welcome to your personalized roadmap for conquering Lesson One in the Habla con Fuego app! 
                Think of this not just as a lesson, but as the exciting first chapter in your Spanish language journey.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-bold text-amber-800 mb-2">What You'll Learn:</h3>
                <ul className="list-disc list-inside space-y-1 text-amber-700">
                  <li>Fundamental Spanish greetings and introductions</li>
                  <li>Essential food and drink vocabulary</li>
                  <li>Numbers 1-20 and telling time</li>
                  <li>Colors and animal names</li>
                  <li>Family members and common places</li>
                  <li>Weather expressions and travel phrases</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Your Learning Path:</h3>
                <div className="flex flex-nowrap overflow-x-auto pb-4 gap-2">
                  {modules.map((module, index) => (
                    <div 
                      key={module.id} 
                      className={`min-w-[120px] p-2 rounded-full text-center border ${index < 2 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-center justify-center">
                        <span className="mr-2">{module.icon}</span>
                        <span className="text-sm font-medium">{module.subtitle.split('&')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-spanish-teal hover:bg-spanish-darkteal"
                onClick={() => setSelectedTab('modules')}
              >
                Explore Modules
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Building Your Foundation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Completing Lesson One isn't just about ticking boxes; it's about building a robust foundation 
                for your entire Spanish learning journey.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Core Vocabulary</h3>
                  <p className="text-sm">Essential words and phrases for everyday topics that form the foundation of your Spanish vocabulary.</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Basic Grammar</h3>
                  <p className="text-sm">Introduction to fundamental grammatical concepts like gendered nouns and simple verb forms.</p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Pronunciation</h3>
                  <p className="text-sm">Train your ear to recognize Spanish sounds and practice proper pronunciation.</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Confidence Building</h3>
                  <p className="text-sm">Gain the confidence to engage in simple interactions and express basic needs in Spanish.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modules">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {modules.map((module) => (
              <motion.div key={module.id} variants={item}>
                <Card className="h-full flex flex-col">
                  <CardHeader className={`bg-${module.color}-50 border-b border-${module.color}-100`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{module.icon}</span>
                        <div>
                          <CardTitle>{module.title}</CardTitle>
                          <p className="text-sm text-gray-500">{module.subtitle}</p>
                        </div>
                      </div>
                      {completedModules.includes(module.id) && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 py-4">
                    <p className="mb-4">{module.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Activities:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {module.activities.map((activity, index) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {module.categories.map((category) => (
                        <Badge key={category} className={`${colorVariants[module.color]}`}>
                          {category}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-spanish-teal hover:bg-spanish-darkteal"
                      onClick={() => startModule(module.id)}
                    >
                      Start Module
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Overall Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-spanish-teal h-4 rounded-full"
                      style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {completedModules.length} of {modules.length} modules completed
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Module Status</h3>
                  <div className="space-y-2">
                    {modules.map((module) => (
                      <div key={module.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">{module.icon}</span>
                          <span>{module.subtitle}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={completedModules.includes(module.id) 
                            ? "bg-green-50 text-green-700 border-green-300" 
                            : "bg-amber-50 text-amber-700 border-amber-300"}
                        >
                          {completedModules.includes(module.id) ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Next Steps</h3>
                  <p>Continue your Spanish journey by completing the remaining modules in Lesson One.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2 border-blue-300 text-blue-700"
                    onClick={() => setSelectedTab('modules')}
                  >
                    Return to Modules
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonRoadmap;
