import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (username, password) => {
  try {
    const response = await api.post('/token', { username, password });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// User
export const getCurrentUser = async () => {
  const response = await api.get('/users/me/');
  return response.data;
};

export const getUserPersona = async () => {
  const response = await api.get('/users/me/persona');
  return response.data;
};

export const getUserMood = async () => {
  const response = await api.get('/users/me/mood');
  return response.data;
};

export const getUserBehaviors = async () => {
  const response = await api.get('/users/me/behaviors');
  return response.data;
};

// Products
export const getProducts = async () => {
  const response = await api.get('/products/');
  return response.data;
};

export const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

// Recommendations
export const getRecommendations = async () => {
  const response = await api.get('/recommendations/');
  return response.data;
};

// Shopping Lists
export const getShoppingLists = async () => {
  const response = await api.get('/shopping-lists/');
  return response.data;
};

export const createShoppingList = async (data) => {
  const response = await api.post('/shopping-lists/', data);
  return response.data;
};

export const addShoppingListItem = async (listId, item) => {
  const response = await api.post(`/shopping-lists/${listId}/items/`, item);
  return response.data;
};

// Mood
export const getMoodHistory = async () => {
  const response = await api.get('/mood/');
  return response.data;
};

export const updateMood = async (mood) => {
  const response = await api.post('/mood/', { mood });
  return response.data;
};

// Analytics
export const getShoppingPatterns = async () => {
  const response = await api.get('/analytics/shopping-patterns');
  return response.data;
};

export const getMoodTrends = async () => {
  const response = await api.get('/analytics/mood-trends');
  return response.data;
};

export const getCategoriesDistribution = async () => {
  const response = await api.get('/analytics/categories');
  return response.data;
};

export const getRecommendationPerformance = async () => {
  const response = await api.get('/analytics/recommendations');
  return response.data;
};

// Quick Actions
export const executeQuickAction = async (actionType, data) => {
  const response = await api.post(`/quick-actions/${actionType}`, data);
  return response.data;
};

export const fetchRecommendations = async (customerId, mood = null) => {
  try {
    const params = { customer_id: customerId };
    if (mood) params.mood = mood;
    
    const res = await api.get('/recommend_products', { params });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchPersona = async (customerId) => {
  try {
    const res = await api.get('/generate_persona', {
      params: { customer_id: customerId }
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchProductStory = async (productId) => {
  try {
    const res = await api.get('/product_storytelling', {
      params: { product_id: productId }
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const submitVoiceSearch = async (query, customerId) => {
  try {
    const res = await api.post('/chat', {
      query,
      customer_id: customerId,
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const sendChatMessage = async (message, customerId) => {
  try {
    const res = await api.post('/chat', {
      message,
      customer_id: customerId,
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchExplainability = async (productId, customerId) => {
  const res = await api.post('/explain', {
    product_id: productId,
    customer_id: customerId,
  });
  return res.data;
};

export const getProductExplanation = async ({ customer_id, product_id }) => {
  try {
    const res = await api.post('/explain', {
      customer_id,
      product_id,
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getPsychographicMatch = async (customer_id) => {
  try {
    const res = await api.get(`/psychographic/${customer_id}`);
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const updateBehavior = async ({ customer_id, behavior }) => {
  try {
    const res = await api.post('/submit_behavior', {
      customer_id,
      behavior,
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const logProductInteraction = async ({ customer_id, product_id, action_type }) => {
  try {
    const res = await api.post('/submit_behavior', {
      customer_id,
      behavior: {
        product_id,
        action_type,
        timestamp: new Date().toISOString(),
      },
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
  