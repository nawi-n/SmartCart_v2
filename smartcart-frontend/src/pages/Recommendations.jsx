import React, { useEffect, useState } from 'react';
import { getPsychographicMatch } from '@services/api';
import ProductCard from '@components/ProductCard';
import { Loader2, AlertTriangle } from 'lucide-react';

const Recommendations = ({ customerId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPsychographicRecommendations = async () => {
    try {
      const data = await getPsychographicMatch(customerId);
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to fetch psychographic recommendations.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!customerId) return;
    fetchPsychographicRecommendations();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        <span>Loading personalized suggestions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <AlertTriangle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        🎯 Psychographic Matches Just for You
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No matches found. Try updating your persona or mood!
        </p>
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

export default Recommendations;
