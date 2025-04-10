import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [currentMood, setCurrentMood] = useState(null);
  const [persona, setPersona] = useState(null);
  const [chatAssistant, setChatAssistant] = useState(null);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);

  // Update user's mood
  const updateMood = useCallback(async (mood) => {
    try {
      const response = await axios.post('/api/mood/', { mood });
      setCurrentMood(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating mood:', error);
      throw error;
    }
  }, []);

  // Get user's persona
  const getPersona = useCallback(async () => {
    try {
      const response = await axios.get('/api/users/me/persona');
      setPersona(response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting persona:', error);
      throw error;
    }
  }, []);

  // Get product recommendations
  const getRecommendations = useCallback(async () => {
    try {
      const response = await axios.get('/api/recommendations/');
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }, []);

  // Analyze shopping list
  const analyzeShoppingList = useCallback(async (listId) => {
    try {
      const response = await axios.get(`/api/shopping-lists/${listId}/analysis`);
      return response.data;
    } catch (error) {
      console.error('Error analyzing shopping list:', error);
      throw error;
    }
  }, []);

  // Get analytics data
  const getAnalytics = useCallback(async (type) => {
    try {
      const response = await axios.get(`/api/analytics/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }, []);

  // Toggle voice search
  const toggleVoiceSearch = useCallback(() => {
    setIsVoiceSearchActive(prev => !prev);
  }, []);

  // Initialize chat assistant
  const initChatAssistant = useCallback(() => {
    setChatAssistant({
      isOpen: false,
      messages: [],
    });
  }, []);

  const value = {
    currentMood,
    persona,
    chatAssistant,
    isVoiceSearchActive,
    updateMood,
    getPersona,
    getRecommendations,
    analyzeShoppingList,
    getAnalytics,
    toggleVoiceSearch,
    initChatAssistant,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}; 