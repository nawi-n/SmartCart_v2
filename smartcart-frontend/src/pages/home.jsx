import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, getCurrentUser } from '@services/api';
import ProductCard from '@components/ProductCard';
import { Loader2, AlertTriangle, ShoppingCart } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      // First check if user is authenticated
      const userData = await getCurrentUser();
      setUser(userData);

      // Then fetch recommendations
      const data = await getRecommendations();
      setProducts(data.recommendations || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError('Failed to fetch recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        <span>Loading recommendations...</span>
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
      <div className="flex items-center justify-center mb-8">
        <ShoppingCart className="w-8 h-8 mr-2" />
        <h1 className="text-3xl font-bold text-center">
          Your SmartCart Recommendations
        </h1>
      </div>

      {user && (
        <p className="text-center text-gray-600 mb-6">
          Welcome back, {user.name || 'Shopper'}!
        </p>
      )}

      {products.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No recommendations available.</p>
          <p className="mt-2">Try updating your preferences to see personalized recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              userId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
