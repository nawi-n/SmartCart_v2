import { useState, useEffect } from 'react';
import { useAI } from '../context/AIContext';
import { MicrophoneIcon } from '@heroicons/react/24/outline';

const VoiceSearch = ({ onSearch }) => {
  const { isVoiceSearchActive, toggleVoiceSearch } = useAI();
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setTranscript(transcript);
          onSearch(transcript);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, [onSearch]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full ${
          isListening
            ? 'bg-red-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <MicrophoneIcon className="h-5 w-5" />
      </button>
      {isListening && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></div>
          <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
        </div>
      )}
      {transcript && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch; 