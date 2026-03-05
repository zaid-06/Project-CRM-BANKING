// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('bankfinance_user');
    if (savedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AppProvider>  {/* ✅ Provider wrap karna bhoolna mat */}
      <div className="App">
        {!isLoggedIn ? (
          <LoginPage setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Dashboard setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </AppProvider>
  );
}

export default App;