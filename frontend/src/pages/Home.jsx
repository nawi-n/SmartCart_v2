import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: 'Smartphone X',
    price: 699.99,
    category: 'Electronics',
    image: 'https://source.unsplash.com/random/400x400/?smartphone',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Laptop Pro',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://source.unsplash.com/random/400x400/?laptop',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Wireless Headphones',
    price: 199.99,
    category: 'Electronics',
    image: 'https://source.unsplash.com/random/400x400/?headphones',
    rating: 4.3,
  },
  {
    id: 4,
    name: 'Smart Watch',
    price: 299.99,
    category: 'Electronics',
    image: 'https://source.unsplash.com/random/400x400/?smartwatch',
    rating: 4.6,
  },
  {
    id: 5,
    name: 'Gaming Console',
    price: 499.99,
    category: 'Electronics',
    image: 'https://source.unsplash.com/random/400x400/?gaming',
    rating: 4.7,
  },
  {
    id: 6,
    name: 'Digital Camera',
    price: 799.99,
    category: 'Electronics',
    image: 'https://source.unsplash.com/random/400x400/?camera',
    rating: 4.4,
  },
];

const categories = [
  { id: 'electronics', name: 'Electronics', icon: '🔌' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'home', name: 'Home & Kitchen', icon: '🏠' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'toys', name: 'Toys & Games', icon: '🎮' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
];

const Home = () => {
  const [products, setProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category.toLowerCase() === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-flipkart-blue text-white rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to SmartCart</h1>
        <p className="text-xl mb-6">Your AI-powered shopping companion</p>
        <button className="btn-secondary">Start Shopping</button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedCategory === category.id
                  ? 'bg-flipkart-blue text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl mb-2 block">{category.icon}</span>
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 