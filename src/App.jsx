import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './LoginPage';
import AIInterviewBot from './main';
import HistoryPage from './HistoryPage';
import { LogOut, History } from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
        });
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (user) => setCurrentUser(user);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentUser && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <a href="/history"
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all shadow-lg font-semibold">
            <History className="w-4 h-4" />
            My History
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-lg font-semibold">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}

      <Routes>
        <Route path="/login" element={
          currentUser ? <Navigate to="/bot" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
        } />
        <Route path="/bot" element={
          currentUser ? <AIInterviewBot currentUser={currentUser} /> : <Navigate to="/login" />
        } />
        <Route path="/history" element={
          currentUser ? <HistoryPage currentUser={currentUser} /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}