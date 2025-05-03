
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, SkipBack, Repeat } from 'lucide-react';
import { playAudio } from '@/services/textToSpeech';
import { toast } from 'sonner';

interface SpeechControlsProps {
  text: string;
  language?: string;
}

const SpeechControls = ({ text, language = 'es' }: SpeechControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayAudio = async () => {
    try {
      // Immediate playback with normal speed
      setIsPlaying(true);
      await playAudio(text, {
        languageCode: language,
        volume: 1.0,
        rate: 1.0, // Normal speed
      });
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio');
      setIsPlaying(false);
    }
  };
  
  // Play slower
  const handleSlowPlayback = async () => {
    try {
      setIsPlaying(true);
      await playAudio(text, {
        languageCode: language,
        volume: 1.0,
        rate: 0.5, // Half speed for slower playback
      });
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio');
      setIsPlaying(false);
    }
  };
  
  // Repeat 3 times with pauses between
  const handleRepeat = async () => {
    try {
      setIsPlaying(true);
      
      // Play three times with short pauses between
      for (let i = 0; i < 3; i++) {
        // If not the first iteration, add a small pause
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        await playAudio(text, {
          languageCode: language,
          volume: 1.0,
          rate: 1.0,
        });
      }
      
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio');
      setIsPlaying(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <div className="flex gap-2 mt-1">
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex-1 ${isPlaying ? 'animate-pulse bg-gray-100' : ''}`}
          onClick={handlePlayAudio}
          disabled={isPlaying}
        >
          <Volume2 size={16} className="mr-2" />
          Play
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex-1 ${isPlaying ? 'animate-pulse bg-gray-100' : ''}`}
          onClick={handleSlowPlayback}
          disabled={isPlaying}
        >
          <SkipBack size={16} className="mr-2" />
          Slow
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex-1 ${isPlaying ? 'animate-pulse bg-gray-100' : ''}`}
          onClick={handleRepeat}
          disabled={isPlaying}
        >
          <Repeat size={16} className="mr-2" />
          Repeat
        </Button>
      </div>
    </div>
  );
};

export default SpeechControls;
