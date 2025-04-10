import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AIProvider } from './context/AIContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatAssistant from './components/ChatAssistant';
import MoodSelector from './components/MoodSelector';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
      <ChatAssistant />
      <MoodSelector />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AIProvider>
          <AppContent />
        </AIProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
