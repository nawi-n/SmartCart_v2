import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/api/users/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('/api/token', {
        username: email,
        password: password
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      const userResponse = await axios.get('/api/users/me/', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      setUser(userResponse.data);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [navigate]);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      await axios.post('/api/users/', userData);
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, [login]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Update user preferences
  const updatePreferences = useCallback(async (preferences) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('/api/users/me/', { preferences }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updatePreferences,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 