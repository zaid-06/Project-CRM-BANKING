// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/sections/RegisterPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('bankfinance_user');
    if (savedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AppProvider>
      <div className="App">
        {isLoggedIn ? (
          <Dashboard setIsLoggedIn={setIsLoggedIn} />
        ) : showRegister ? (
          <RegisterPage onGoToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginPage
            setIsLoggedIn={setIsLoggedIn}
            onGoToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    </AppProvider>
  );
}

export default App;