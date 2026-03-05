// src/context/AppContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    // Agar context nahi mila to default values return karein
    return {
      currentUser: null,
      userType: 'admin',
      leads: [],
      setLeads: () => {},
      employees: [],
      setEmployees: () => {},
      clients: [],
      setClients: () => {},
      knowledgeBase: [],
      setKnowledgeBase: () => {},
      reminders: [],
      setReminders: () => {},
      notifications: [],
      setNotifications: () => {},
      showAlert: (msg, type) => console.log(msg, type)
    };
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('admin');
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Remove dummy data; leads and clients will come from backend
  }, []);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const value = {
    currentUser, setCurrentUser,
    userType, setUserType,
    leads, setLeads,
    employees, setEmployees,
    clients, setClients,
    knowledgeBase, setKnowledgeBase,
    reminders, setReminders,
    notifications, setNotifications,
    showAlert
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> 
          {alert.message}
        </div>
      )}
    </AppContext.Provider>
  );
};