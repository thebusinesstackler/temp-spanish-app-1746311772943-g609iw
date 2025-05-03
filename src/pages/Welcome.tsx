
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flag } from "lucide-react";
import FoxMascot from '@/components/FoxMascot';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'language' | 'reason'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showFoxMessage, setShowFoxMessage] = useState(true);
  
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    // Instead of going to reason step, go directly to the learning roadmap
    localStorage.setItem('learningLanguage', language);
    navigate('/learning-path');
  };
  
  const handleReasonSelect = (reason: string) => {
    // Save the reason and language to localStorage or context if needed
    localStorage.setItem('learningLanguage', selectedLanguage || 'Spanish');
    localStorage.setItem('learningReason', reason);
    
    // Navigate to the learning path
    navigate('/learning-path');
  };

  return (
    <div className="min-h-screen bg-[#f0f9f8]">
      {/* Header with timer */}
      {step === 'language' && (
        <div className="bg-spanish-teal py-4 text-white">
          <div className="container mx-auto text-center">
            <h2 className="font-bold">Limited time offer!</h2>
            <div className="flex justify-center gap-4 mt-2">
              <div className="bg-[#008b8b]/40 px-3 py-1 rounded">
                <div className="text-xl font-bold">2</div>
                <div className="text-xs">DAYS</div>
              </div>
              <div className="bg-[#008b8b]/40 px-3 py-1 rounded">
                <div className="text-xl font-bold">11</div>
                <div className="text-xs">HOURS</div>
              </div>
              <div className="bg-[#008b8b]/40 px-3 py-1 rounded">
                <div className="text-xl font-bold">24</div>
                <div className="text-xs">MINUTES</div>
              </div>
              <div className="bg-[#008b8b]/40 px-3 py-1 rounded">
                <div className="text-xl font-bold">36</div>
                <div className="text-xs">SECONDS</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {step === 'language' ? (
          <>
            <div className="text-center mb-8 relative">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-4"
              >
                <FoxMascot 
                  size="lg" 
                  message="¡Hola! I'm Foxy, and I'll help you learn Spanish!" 
                  showMessage={showFoxMessage}
                  onMessageClose={() => setShowFoxMessage(false)}
                />
              </motion.div>
              
              <h1 className="text-5xl font-bold text-spanish-teal mb-4">¡Feliz Cinco de Mayo!</h1>
              <p className="text-lg">Shop our best deals and start learning today</p>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-8">First Step: Pick a language</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow border-2 border-spanish-teal"
                  onClick={() => handleLanguageSelect('Spanish')}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center mb-3">
                    <img 
                      src="/lovable-uploads/dd91c551-bbfa-4ec3-9c1d-7c6070b9f889.png" 
                      alt="Mexican Flag" 
                      className="w-full h-auto"
                    />
                  </div>
                  <span className="font-medium">Spanish</span>
                </Card>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLanguageSelect('Spanish')} // All lead to Spanish for this app
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center mb-3">
                    <Flag className="w-10 h-10 text-blue-500" />
                  </div>
                  <span className="font-medium">French</span>
                </Card>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLanguageSelect('Spanish')} // All lead to Spanish for this app
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center mb-3">
                    <Flag className="w-10 h-10 text-yellow-500" />
                  </div>
                  <span className="font-medium">German</span>
                </Card>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLanguageSelect('Spanish')} // All lead to Spanish for this app
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center mb-3">
                    <Flag className="w-10 h-10 text-green-500" />
                  </div>
                  <span className="font-medium">Italian</span>
                </Card>
              </motion.div>
            </div>
            
            <div className="mt-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-spanish-teal hover:bg-spanish-darkteal text-white px-10 py-6 text-lg rounded-full"
                  onClick={() => handleLanguageSelect('Spanish')}
                >
                  Continue with Spanish
                </Button>
              </motion.div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-spanish-teal mb-6">Why are you learning Spanish?</h1>
            </div>
            
            <div className="flex flex-col gap-3 max-w-xl mx-auto">
              {[
                "To connect with family / friends",
                "I need it for my career",
                "I need it for an upcoming trip", 
                "I need it for school",
                "I just enjoy learning languages",
                "I want to do it as a brain exercise",
                "Other"
              ].map((reason) => (
                <motion.div
                  key={reason}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="py-6 text-left justify-start text-base normal-case border rounded-xl hover:border-spanish-teal hover:bg-gray-50 w-full"
                    onClick={() => handleReasonSelect(reason)}
                  >
                    {reason}
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Login button at top */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          className="bg-white rounded-full px-6 hover:bg-gray-100"
        >
          Log in
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
