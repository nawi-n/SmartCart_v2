import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAI } from '../context/AIContext';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { persona } = useAI();
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState(null);

  const fetchInsights = async () => {
    try {
      const response = await fetch(`/api/products/${product.id}/insights`);
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const toggleInsights = () => {
    if (!insights) {
      fetchInsights();
    }
    setShowInsights(!showInsights);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {persona && product.match_percentage && (
            <div className="absolute top-2 right-2 bg-flipkart-blue text-white px-2 py-1 rounded-full text-sm">
              {product.match_percentage}% Match
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-flipkart-blue">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <p className="text-flipkart-blue font-bold">${product.price}</p>
          <div className="flex space-x-2">
            <button
              onClick={toggleInsights}
              className="text-gray-500 hover:text-flipkart-blue"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-red-500">
              <HeartIcon className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-flipkart-blue">
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showInsights && insights && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">AI Insights</h4>
            <p className="text-sm text-gray-600">{insights.explanation}</p>
            {insights.recommendations && (
              <ul className="mt-2 text-sm text-gray-600">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="list-disc ml-4">
                    {rec}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 