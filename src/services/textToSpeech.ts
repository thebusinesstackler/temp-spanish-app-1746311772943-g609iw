
import { toast } from '@/hooks/use-toast';

// Text-to-speech service using Web Speech API
interface TTSOptions {
  text: string;
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  languageCode?: string;
  cacheKey?: string; // Optional key for caching
}

// Audio cache to prevent redundant API calls
const audioCache = new Map<string, string>();

export const textToSpeech = async (options: TTSOptions): Promise<string | null> => {
  const {
    text,
    rate = 0.9,
    pitch = 1.0,
    volume = 1.0,
    languageCode,
    cacheKey = text
  } = options;
  
  // Check if we have this audio cached already
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey) || null;
  }
  
  try {
    // Create a temporary audio context and record the speech
    const audioContext = new AudioContext();
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    
    const audioChunks: Blob[] = [];
    
    return new Promise((resolve, reject) => {
      // Get the Web Speech API
      if (!window.speechSynthesis) {
        toast({
          title: "Speech Synthesis Unavailable",
          description: "Your browser doesn't support text-to-speech",
          variant: "destructive"
        });
        return reject("Speech synthesis not supported");
      }

      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      // Set language if specified or default to Spanish
      if (languageCode) {
        utterance.lang = languageCode;
      } else if (languageCode === 'es' || /[áéíóúñ¿¡]/i.test(text)) {
        // If specifically requested Spanish or text contains Spanish characters
        utterance.lang = 'es-ES';
      }
      
      // Find an appropriate voice
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a voice that matches the language
        const preferredVoice = voices.find(voice => 
          (languageCode && voice.lang.startsWith(languageCode)) ||
          (utterance.lang && voice.lang.startsWith(utterance.lang))
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }
      
      // Just play the audio directly instead of recording
      utterance.onend = () => {
        // Since we can't easily cache the speech, we'll use a placeholder URL
        // for caching purposes to indicate speech was successful
        const placeholderUrl = `speech:${cacheKey}`;
        audioCache.set(cacheKey, placeholderUrl);
        resolve(placeholderUrl);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        reject("Speech synthesis failed");
      };
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    });
    
  } catch (error) {
    console.error("Text-to-speech error:", error);
    toast({
      title: "Audio Generation Failed",
      description: "Could not generate speech audio",
      variant: "destructive"
    });
    return null;
  }
};

// Play audio from URL or text
export const playAudio = async (textOrUrl: string, options: Partial<TTSOptions> = {}): Promise<void> => {
  // If it starts with "speech:", it's our placeholder for cached speech
  if (textOrUrl.startsWith('speech:')) {
    // Get the original text and speak it again
    const originalText = textOrUrl.replace('speech:', '');
    await textToSpeech({
      text: originalText,
      ...options,
    });
    return;
  }
  
  // If text doesn't look like a URL, convert it to speech
  if (!textOrUrl.startsWith('blob:') && !textOrUrl.startsWith('http')) {
    await textToSpeech({
      text: textOrUrl,
      ...options,
    });
    return;
  }
  
  // Handle actual audio URLs (like MP3 files)
  const audio = new Audio(textOrUrl);
  audio.volume = options.volume || 1.0;
  
  audio.onerror = () => {
    toast({
      title: "Playback Error",
      description: "Could not play the audio",
      variant: "destructive"
    });
  };
  
  await audio.play();
};

// Clear the audio cache 
export const clearAudioCache = (): void => {
  audioCache.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
  audioCache.clear();
};

// Helper to preload voices (needed in some browsers)
export const preloadVoices = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (window.speechSynthesis) {
      // If voices are already loaded
      if (speechSynthesis.getVoices().length > 0) {
        return resolve();
      }
      
      // Wait for voices to be loaded
      speechSynthesis.onvoiceschanged = () => {
        resolve();
      };
      
      // Try to trigger voice loading
      speechSynthesis.getVoices();
    } else {
      resolve(); // Resolve anyway if speech synthesis isn't available
    }
  });
};

// Play a sound effect
export const playSoundEffect = (soundType: 'correct' | 'incorrect' | 'general'): void => {
  let soundPath = '';
  
  switch (soundType) {
    case 'correct':
      soundPath = '/correct-answer.mp3';
      break;
    case 'incorrect':
      soundPath = '/incorrect-answer.mp3'; // You'll need to add this file
      break;
    default:
      soundPath = '/notification.mp3'; // You'll need to add this file
      break;
  }
  
  try {
    const audio = new Audio(soundPath);
    audio.volume = 1.0; // Always play sound effects at max volume
    audio.play().catch(error => {
      console.info("Audio playback error:", error);
    });
  } catch (error) {
    console.error("Sound effect playback error:", error);
  }
};
