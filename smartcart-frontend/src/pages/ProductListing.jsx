import React, { useState, useEffect } from 'react';
import { getRecommendations, getProductStory, getProductExplanation } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductListing = ({ customerId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const mood = localStorage.getItem('currentMood') || 'neutral';
        const recommendations = await getRecommendations(customerId, mood);
        setProducts(recommendations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [customerId]);

  const handleProductClick = async (product) => {
    try {
      // Get product story
      const story = await getProductStory(product.id);
      
      // Get product explanation
      const explanation = await getProductExplanation(product.id, customerId);
      
      setSelectedProduct({
        ...product,
        story,
        explanation
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recommended Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product)}
            isSelected={selectedProduct?.id === product.id}
          />
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Story</h3>
              <p className="text-gray-700">{selectedProduct.story}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Why we recommend this</h3>
              <p className="text-gray-700">{selectedProduct.explanation}</p>
            </div>
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing; 