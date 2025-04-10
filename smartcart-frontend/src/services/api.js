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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (token expired/invalid)
          localStorage.removeItem('token');
          window.location.href = '/';
          break;
        case 400:
          // Handle bad request
          console.error('Bad request:', error.response.data);
          break;
        case 422:
          // Handle validation error
          console.error('Validation error:', error.response.data);
          break;
        case 500:
          // Handle server error
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('email', email);
  formData.append('password', password);

  const response = await api.post('/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  localStorage.setItem('token', response.data.access_token);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/users/', {
    email: userData.email,
    password: userData.password,
    first_name: userData.firstName,
    last_name: userData.lastName
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me/');
  return response.data;
};

// Products
export const createProduct = async (productData) => {
  const response = await api.post('/products/', {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category
  });
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products/');
  return response.data;
};

export const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

// Shopping Lists
export const getShoppingLists = async () => {
  const response = await api.get('/shopping-lists/');
  return response.data;
};

export const createShoppingList = async (name) => {
  const response = await api.post('/shopping-lists/', { name });
  return response.data;
};

export const addItemToShoppingList = async (listId, productId, quantity) => {
  const response = await api.post(`/shopping-lists/${listId}/items/`, {
    product_id: productId,
    quantity: quantity
  });
  return response.data;
};

export const analyzeShoppingList = async (listId) => {
  const response = await api.get(`/shopping-lists/${listId}/analysis`);
  return response.data;
};

// Updates & Recommendations
export const getUpdates = async () => {
  const response = await api.get('/updates');
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/recommendations/');
  return response.data;
};

// User AI Agents
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

// Quick Actions & Mood
export const executeQuickAction = async (actionType, data) => {
  const response = await api.post(`/quick-actions/${actionType}`, data);
  return response.data;
};

export const getMoodHistory = async () => {
  const response = await api.get('/mood/');
  return response.data;
};

export const updateMood = async (mood) => {
  const response = await api.post('/mood/', { mood });
  return response.data;
};

// Persona
export const generatePersona = async (customerId) => {
  const response = await api.get('/generate_persona', {
    params: { customer_id: customerId }
  });
  return response.data;
};

export const getPersona = async () => {
  const response = await api.get('/users/me/persona');
  return response.data;
};

export const getProductStory = async (productId) => {
  const response = await api.get('/product_storytelling', {
    params: { product_id: productId }
  });
  return response.data;
};

export const getProductExplanation = async (productId, customerId) => {
  const response = await api.post('/explain', {
    product_id: productId,
    customer_id: customerId
  });
  return response.data;
};

// Chat
export const sendChatMessage = async (message, customerId) => {
  const response = await api.post('/chat', {
    message,
    customer_id: customerId
  });
  return response.data;
};

// Behavior Logging
export const submitBehavior = async (customerId, behavior) => {
  const response = await api.post('/submit_behavior', {
    customer_id: customerId,
    behavior
  });
  return response.data;
};

export const logProductInteraction = async (customerId, productId, actionType) => {
  return submitBehavior(customerId, {
    product_id: productId,
    action_type: actionType,
    timestamp: new Date().toISOString()
  });
};

// Psychographic
export const getPsychographicMatch = async (customerId) => {
  const response = await api.get(`/psychographic/${customerId}`);
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

export const fetchExplainability = async (productId, customerId) => {
  const res = await api.post('/explain', {
    product_id: productId,
    customer_id: customerId,
  });
  return res.data;
};

// Update Behavior
export const updateBehavior = async ({ customer_id, behavior }) => {
  const response = await api.post('/users/me/behaviors', {
    customer_id,
    behavior,
  });
  return response.data;
  };
  