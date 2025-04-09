import React, { useState } from 'react';
import { Card } from '@components/ui/card';
import { Info, Sparkles, Lightbulb } from 'lucide-react';
import { getProductExplanation } from '@services/api';

const ProductCard = ({ product, customerId }) => {
  const [showStory, setShowStory] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleStory = () => setShowStory((prev) => !prev);

  const toggleExplanation = async () => {
    if (showExplanation) {
      setShowExplanation(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getProductExplanation({
        customer_id: customerId,
        product_id: product.id || product.product_id,
      });
      setExplanation(res.explanation || 'No explanation available.');
    } catch (err) {
      setExplanation('Failed to fetch explanation.');
      console.error('Error fetching explanation:', err);
    } finally {
      setLoading(false);
      setShowExplanation(true);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all p-4 w-full bg-white">
      <div className="flex flex-col items-center">
        <img
          src={!imageError && product.image_url ? product.image_url : '/placeholder.png'}
          alt={product.name}
          className="w-40 h-40 object-contain rounded-lg mb-4"
          onError={handleImageError}
        />

        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.brand}</p>

        <div className="mt-2 text-sm font-medium text-green-600">
          Match: {product.match_percent || '0'}%
        </div>

        {/* Storytelling Section */}
        <button
          onClick={toggleStory}
          className="text-blue-600 mt-3 flex items-center gap-1 text-sm hover:underline"
        >
          <Sparkles className="w-4 h-4" />
          {showStory ? 'Hide' : 'Show'} AI Story
        </button>
        {showStory && (
          <p className="text-sm text-gray-700 mt-1">{product.story || 'No story available.'}</p>
        )}

        {/* Explanation Section */}
        <button
          onClick={toggleExplanation}
          className="text-yellow-600 mt-3 flex items-center gap-1 text-sm hover:underline"
        >
          <Lightbulb className="w-4 h-4" />
          {showExplanation ? 'Hide' : 'Why This Product?'}
        </button>
        {showExplanation && (
          <p className="text-sm text-gray-700 mt-1">
            {loading ? 'Loading explanation...' : explanation}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
