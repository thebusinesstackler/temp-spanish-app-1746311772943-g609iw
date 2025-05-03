import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { 
  Mic, 
  MicOff, 
  Headphones, 
  Save, 
  FileText, 
  Languages, 
  Play,
  Volume2,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import SpeechControls from '@/components/SpeechControls';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ConversationEntry = {
  id: string;
  timestamp: Date;
  audioUrl: string;
  spanishText: string;
  englishText: string;
};

type SuggestedResponse = {
  id: string;
  spanish: string;
  english: string;
};

const ConversationAI = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [spanishTranscription, setSpanishTranscription] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationEntry[]>(() => {
    const saved = localStorage.getItem('savedConversations');
    return saved ? JSON.parse(saved) : [];
  });
  const [suggestedResponses, setSuggestedResponses] = useState<SuggestedResponse[]>([]);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [recordingLanguage, setRecordingLanguage] = useState<string>('es-ES'); // Default to Spanish
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const isMobile = useIsMobile();
  
  // Start recording function
  const startRecording = async () => {
    audioChunksRef.current = [];
    setSpanishTranscription('');
    setEnglishTranslation('');
    setSuggestedResponses([]);
    setAudioUrl(null); // Clear previous audio URL
    
    try {
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioBlobRef.current = audioBlob; // Store the blob for later download
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Create a hidden audio element to test the audio
        if (!audioPlayerRef.current) {
          audioPlayerRef.current = new Audio(url);
        } else {
          audioPlayerRef.current.src = url;
        }
      };
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = recordingLanguage; // Use the selected language
        
        recognitionRef.current = recognition;
        
        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          const currentTranscript = finalTranscript || interimTranscript;
          if (currentTranscript) {
            if (recordingLanguage === 'es-ES') {
              setSpanishTranscription(currentTranscript);
            } else {
              // If recording in English, store in English translation field temporarily
              setEnglishTranslation(currentTranscript);
            }
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event);
          const error = event as SpeechRecognitionErrorEvent;
          toast.error(`Speech recognition error: ${error.error}`);
        };
        
        recognition.onend = () => {
          if (isRecording) {
            // If we're still supposed to be recording, restart recognition
            recognition.start();
          }
        };
        
        recognition.start();
      } else {
        toast.error("Speech recognition is not supported in this browser");
      }
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Listening...");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };
  
  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      // Stop all audio tracks from the stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
      toast.info("Processing recording...");
      
      // Process the recording for translation
      if (recordingLanguage === 'es-ES' && spanishTranscription) {
        processTranscription(spanishTranscription, true); // Spanish to English
      } else if (recordingLanguage === 'en-US' && englishTranslation) {
        processTranscription(englishTranslation, false); // English to Spanish
      }
    }
  };
  
  // Download the recorded audio
  const downloadAudio = () => {
    if (audioBlobRef.current && audioUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.href = audioUrl;
      downloadLink.download = `spanish-recording-${new Date().toISOString().slice(0,10)}.webm`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("Audio downloaded successfully!");
    } else {
      toast.error("No audio available to download");
    }
  };
  
  // Process transcription for translation
  const processTranscription = async (text: string, isSpanishToEnglish: boolean) => {
    if (!text) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate translation with a delay
      setTimeout(() => {
        // Mock translation
        const translatedText = mockTranslate(text, isSpanishToEnglish);
        
        if (isSpanishToEnglish) {
          // Spanish to English
          setEnglishTranslation(translatedText);
        } else {
          // English to Spanish
          setSpanishTranscription(translatedText);
        }
        
        // Generate suggested responses
        generateSuggestedResponses(isSpanishToEnglish ? text : translatedText);
        
        setIsProcessing(false);
        toast.success("Transcription and translation complete!");
        
        // Show results dialog after processing is complete
        setShowResultsDialog(true);
      }, 1500);
    } catch (err) {
      console.error("Error processing translation:", err);
      toast.error("Failed to translate speech");
      setIsProcessing(false);
    }
  };
  
  // Play the recorded audio
  const playRecordedAudio = () => {
    if (audioUrl) {
      if (audioPlayerRef.current) {
        // If we already have an audio player, just play it
        audioPlayerRef.current.play().catch((err) => {
          console.error("Error playing audio:", err);
          toast.error("Failed to play audio recording");
        });
      } else {
        // Create a new audio player if needed
        const audio = new Audio(audioUrl);
        audio.play().catch((err) => {
          console.error("Error playing audio:", err);
          toast.error("Failed to play audio recording");
        });
        audioPlayerRef.current = audio;
      }
    } else {
      toast.error("No audio recording available");
    }
  };
  
  // Mock translation function (replace with actual translation API in production)
  const mockTranslate = (text: string, isSpanishToEnglish: boolean): string => {
    // This is a very basic mock translation - in a real app, you would use a translation API
    const spanishToEnglish: Record<string, string> = {
      'hola': 'hello',
      'cómo estás': 'how are you',
      'buenos días': 'good morning',
      'buenas tardes': 'good afternoon',
      'buenas noches': 'good night',
      'gracias': 'thank you',
      'por favor': 'please',
      'me llamo': 'my name is',
      'qué tal': 'how\'s it going',
      'adiós': 'goodbye'
    };
    
    const englishToSpanish: Record<string, string> = {
      'hello': 'hola',
      'how are you': 'cómo estás',
      'good morning': 'buenos días',
      'good afternoon': 'buenas tardes',
      'good night': 'buenas noches',
      'thank you': 'gracias',
      'please': 'por favor',
      'my name is': 'me llamo',
      'how\'s it going': 'qué tal',
      'goodbye': 'adiós'
    };
    
    const dictionary = isSpanishToEnglish ? spanishToEnglish : englishToSpanish;
    let translatedText = text.toLowerCase();
    
    // Replace known phrases with their translations
    Object.keys(dictionary).forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      translatedText = translatedText.replace(regex, dictionary[phrase]);
    });
    
    // If translation didn't change much, provide a default meaningful translation
    if (translatedText === text.toLowerCase()) {
      return isSpanishToEnglish ? 
        `[Translation: This appears to be about "${text.substring(0, 20)}..." - Please use a translation service for more accuracy]` :
        `[Traducción: Esto parece ser sobre "${text.substring(0, 20)}..." - Por favor use un servicio de traducción para mayor precisión]`;
    }
    
    return translatedText.charAt(0).toUpperCase() + translatedText.slice(1);
  };
  
  // Generate suggested responses
  const generateSuggestedResponses = (spanishText: string) => {
    // In a real app, this would use an AI service to generate contextual responses
    // Here we're using predefined responses as an example
    const commonResponses: SuggestedResponse[] = [
      { id: '1', spanish: 'Sí, estoy de acuerdo.', english: 'Yes, I agree.' },
      { id: '2', spanish: 'No entiendo. ¿Puede repetir, por favor?', english: 'I don\'t understand. Can you repeat, please?' },
      { id: '3', spanish: 'Gracias por compartir eso.', english: 'Thank you for sharing that.' },
      { id: '4', spanish: '¿Puede hablar más despacio, por favor?', english: 'Can you speak more slowly, please?' }
    ];
    
    setSuggestedResponses(commonResponses);
  };
  
  // Play suggested response
  const playResponse = (response: SuggestedResponse) => {
    const utterance = new SpeechSynthesisUtterance(response.spanish);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
    toast.info("Playing response");
  };
  
  // Save conversation
  const saveConversation = () => {
    if (!audioUrl || (!spanishTranscription && !englishTranslation)) {
      toast.error("No conversation to save");
      return;
    }
    
    const newConversation: ConversationEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      audioUrl,
      spanishText: spanishTranscription || "Not provided",
      englishText: englishTranslation || "Not provided",
    };
    
    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    
    // Save to localStorage
    localStorage.setItem('savedConversations', JSON.stringify(updatedConversations));
    
    toast.success("Conversation saved for review!");
  };
  
  // Delete conversation
  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    setConversations(updatedConversations);
    localStorage.setItem('savedConversations', JSON.stringify(updatedConversations));
    toast.success("Conversation deleted");
  };
  
  // Clear current conversation
  const clearCurrentConversation = () => {
    setSpanishTranscription('');
    setEnglishTranslation('');
    setAudioUrl(null);
    setSuggestedResponses([]);
    setShowResultsDialog(false);
  };

  // Effect to clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      // Clean up any object URLs to prevent memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Render saved conversation modal content based on device type
  const SavedConversationsContent = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
      <h2 className="text-xl font-bold text-center mb-4">Your Saved Conversations</h2>
      
      {conversations.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <FileText className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-600">No saved conversations yet</p>
          <p className="text-sm text-gray-400 mt-1">Your recorded and translated conversations will appear here</p>
        </div>
      ) : (
        conversations.map((conv) => (
          <Card key={conv.id} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center text-base">
                <span>
                  {new Date(conv.timestamp).toLocaleDateString()} at {new Date(conv.timestamp).toLocaleTimeString()}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-red-500 hover:text-red-700" 
                  onClick={() => deleteConversation(conv.id)}
                >
                  Delete
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Spanish:</p>
                <p className="text-sm bg-gray-50 p-2 rounded">{conv.spanishText}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">English:</p>
                <p className="text-sm bg-gray-50 p-2 rounded">{conv.englishText}</p>
              </div>
              {conv.audioUrl && (
                <div className="pt-2">
                  <audio controls src={conv.audioUrl} className="w-full h-8" />
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
  
  // Results dialog content
  const ResultsDialogContent = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
      <h2 className="text-xl font-bold text-center mb-4">Conversation Results</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spanish Transcription:
          </label>
          <div className="relative">
            <Textarea 
              value={spanishTranscription}
              readOnly
              className="min-h-24 bg-gray-50"
            />
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute top-2 right-2 h-7 w-7 p-0" 
              onClick={() => {
                navigator.clipboard.writeText(spanishTranscription);
                toast.success("Spanish text copied to clipboard");
              }}
            >
              <FileText size={14} />
            </Button>
          </div>
          {spanishTranscription && (
            <div className="mt-2">
              <SpeechControls text={spanishTranscription} language="es" />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            English Translation:
          </label>
          <div className="relative">
            <Textarea 
              value={englishTranslation}
              readOnly
              className="min-h-24 bg-gray-50"
            />
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute top-2 right-2 h-7 w-7 p-0" 
              onClick={() => {
                navigator.clipboard.writeText(englishTranslation);
                toast.success("English text copied to clipboard");
              }}
            >
              <FileText size={14} />
            </Button>
          </div>
          {englishTranslation && (
            <div className="mt-2">
              <SpeechControls text={englishTranslation} language="en" />
            </div>
          )}
        </div>
        
        {/* Suggested Responses */}
        {suggestedResponses.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggested Responses:
            </label>
            <div className="space-y-2">
              {suggestedResponses.map(response => (
                <div key={response.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div>
                    <p className="text-sm font-medium">{response.spanish}</p>
                    <p className="text-xs text-gray-500">{response.english}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-spanish-teal"
                    onClick={() => playResponse(response)}
                  >
                    <Play size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {audioUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audio Recording:
            </label>
            <div className="flex flex-col gap-2">
              <audio 
                controls 
                src={audioUrl} 
                className="w-full" 
                onError={(e) => {
                  console.error("Audio playback error:", e);
                  toast.error("Error playing the recorded audio");
                }}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 items-center justify-center gap-2"
                  onClick={playRecordedAudio}
                >
                  <Volume2 size={16} /> Play Recording
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 items-center justify-center gap-2"
                  onClick={downloadAudio}
                >
                  <Download size={16} /> Download Audio
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex space-x-3 pt-2">
          <Button
            onClick={saveConversation}
            className="flex-1 bg-spanish-orange hover:bg-spanish-darkorange"
          >
            <Save size={18} className="mr-2" /> Save Conversation
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowResultsDialog(false)}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="border-2 border-spanish-teal">
        <CardHeader className="bg-gradient-to-r from-spanish-teal to-spanish-blue text-white">
          <CardTitle className="text-center">
            Conversation AI
          </CardTitle>
          <p className="text-center text-sm opacity-90">Record, translate, and learn from Spanish conversations</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Language Selection */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Recording Language:
              </label>
              <Select 
                value={recordingLanguage} 
                onValueChange={setRecordingLanguage}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es-ES">Spanish (to be translated to English)</SelectItem>
                  <SelectItem value="en-US">English (to be translated to Spanish)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {recordingLanguage === 'es-ES' 
                  ? 'Speak in Spanish and get an English translation' 
                  : 'Speak in English and get a Spanish translation'}
              </p>
            </div>
          </div>
          
          {/* Recording Status */}
          <div className="text-center">
            {isRecording ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2">
                  <Mic className="text-white" size={32} />
                </div>
                <p className="text-red-500 font-semibold">Listening...</p>
                {recordingLanguage === 'es-ES' ? (
                  spanishTranscription && (
                    <p className="text-sm mt-2 text-gray-700">{spanishTranscription}</p>
                  )
                ) : (
                  englishTranslation && (
                    <p className="text-sm mt-2 text-gray-700">{englishTranslation}</p>
                  )
                )}
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
                <p className="text-amber-500 font-semibold">Processing audio...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Mic className="text-gray-500" size={32} />
                </div>
                <p className="text-gray-500">Ready to record</p>
              </div>
            )}
          </div>
          
          {/* Recording Controls */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-spanish-teal hover:bg-spanish-darkteal"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <><MicOff size={18} className="mr-2" /> Done</>
                ) : (
                  <><Mic size={18} className="mr-2" /> Start Recording</>
                )}
              </Button>
            </div>
            
            {audioUrl && !isRecording && !isProcessing && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={downloadAudio}
                  className="flex items-center"
                >
                  <Download size={18} className="mr-2" /> Save Recorded Audio
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t p-4">
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">
                  <FileText size={18} className="mr-2" /> View Saved Conversations
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Saved Conversations</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <SavedConversationsContent />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText size={18} className="mr-2" /> View Saved Conversations
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Saved Conversations</DialogTitle>
                </DialogHeader>
                <SavedConversationsContent />
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
      
      {/* Results Dialog */}
      {isMobile ? (
        <Drawer open={showResultsDialog} onOpenChange={setShowResultsDialog}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Conversation Results</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <ResultsDialogContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Conversation Results</DialogTitle>
            </DialogHeader>
            <ResultsDialogContent />
          </DialogContent>
        </Dialog>
      )}
      
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-spanish-teal mb-4">About Conversation AI</h3>
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 w-10">
              <Mic className="text-spanish-red" />
            </div>
            <div>
              <h4 className="font-bold">Record Real-life Spanish</h4>
              <p className="text-sm text-gray-600">Capture authentic conversations with native speakers, instructors, or in everyday settings.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10">
              <Languages className="text-spanish-blue" />
            </div>
            <div>
              <h4 className="font-bold">Instant Translation</h4>
              <p className="text-sm text-gray-600">Convert Spanish speech to text and get instant English translations to understand context and meaning.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10">
              <Save className="text-spanish-orange" />
            </div>
            <div>
              <h4 className="font-bold">Build Your Library</h4>
              <p className="text-sm text-gray-600">Save conversations to review later and create custom learning materials from real-world dialogue.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10">
              <Headphones className="text-spanish-teal" />
            </div>
            <div>
              <h4 className="font-bold">Immersive Learning</h4>
              <p className="text-sm text-gray-600">Improve listening comprehension, vocabulary retention, and understanding of natural speech patterns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationAI;
