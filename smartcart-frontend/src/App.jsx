import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import ProductListing from './pages/ProductListing';
import VoiceSearch from './pages/VoiceSearch';
import Chat from './pages/Chat';
import Sidebar from './components/Sidebar';
import MoodPicker from './components/MoodPicker';
import BehaviorLogger from './components/BehaviorLogger';
import FloatingChatBot from './components/FloatingChatBot';
import { getCurrentUser } from './services/api';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <BehaviorLogger customerId={user?.id || 'default'} />
      
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" />
            ) : (
              <Landing />
            )
          }
        />
        
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <div className="flex h-screen">
                <Sidebar>
                  <MoodPicker customerId={user?.id} />
                </Sidebar>
                
                <main className="flex-1 overflow-auto">
                  <ProductListing customerId={user?.id} />
                </main>
                
                <FloatingChatBot customerId={user?.id} />
              </div>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/voice-search"
          element={
            <PrivateRoute>
              <div className="flex h-screen">
                <Sidebar>
                  <MoodPicker customerId={user?.id} />
                </Sidebar>
                
                <main className="flex-1 overflow-auto">
                  <VoiceSearch customerId={user?.id} />
                </main>
              </div>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <div className="flex h-screen">
                <Sidebar>
                  <MoodPicker customerId={user?.id} />
                </Sidebar>
                
                <main className="flex-1 overflow-auto">
                  <Chat customerId={user?.id} />
                </main>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
