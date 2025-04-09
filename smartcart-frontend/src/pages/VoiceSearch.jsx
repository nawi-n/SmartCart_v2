import React, { useState } from 'react';
import { submitVoiceSearch } from '@services/api';
import ProductCard from '@components/ProductCard';
import { Mic, MicOff, Loader2, Search } from 'lucide-react';

const VoiceSearch = ({ customerId }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const handleListen = () => {
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);
      fetchProducts(speechText);
    };

    recognition.start();
  };

  const fetchProducts = async (query) => {
    setLoading(true);
    try {
      const data = await submitVoiceSearch(query, customerId);
      setProducts(data.recommendations || []);
    } catch (err) {
      console.error('Voice search failed:', err);
      alert('Voice search failed!');
    }
    setLoading(false);
  };

  return (
    <div className="px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">🎙️ Voice Product Search</h1>

      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={handleListen}
          className="bg-blue-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-blue-600"
        >
          {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {listening ? 'Listening...' : 'Start Voice Search'}
        </button>
      </div>

      {transcript && (
        <p className="text-center text-gray-600 italic mb-4">
          You said: "<strong>{transcript}</strong>"
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          <span>Searching for products...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id || product.product_id}
              product={product}
              customerId={customerId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;
