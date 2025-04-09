import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/Login";
import Recommendations from "./pages/Recommendations";
import Chat from "./pages/Chat";
import FloatingChatBot from "./components/FloatingChatBot";
import VoiceSearch from "./pages/VoiceSearch";
import Sidebar from "./components/Sidebar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppLayout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <main className="ml-64 flex-1 p-4 bg-gray-50 min-h-screen">
      {children}
      <FloatingChatBot />
    </main>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <PrivateRoute>
              <AppLayout>
                <Recommendations />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <AppLayout>
                <Chat />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/voice-search"
          element={
            <PrivateRoute>
              <AppLayout>
                <VoiceSearch />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
