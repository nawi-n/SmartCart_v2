import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAI } from '../context/AIContext';
import { MagnifyingGlassIcon, UserIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import VoiceSearch from './VoiceSearch';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { isVoiceSearchActive } = useAI();

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-flipkart-blue">SmartCart</span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-flipkart-blue focus:border-flipkart-blue sm:text-sm"
                  placeholder="Search products..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <VoiceSearch onSearch={handleSearch} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-600 hover:text-flipkart-blue"
                >
                  <HeartIcon className="h-6 w-6" />
                </Link>
                <Link
                  to="/cart"
                  className="p-2 text-gray-600 hover:text-flipkart-blue"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                </Link>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-2">{user.first_name}</span>
                    <button
                      onClick={logout}
                      className="text-gray-600 hover:text-flipkart-blue"
                    >
                      <UserIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-flipkart-blue"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-flipkart-blue text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 