// src/components/Dashboard.js (Complete Fixed Version)
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Header from './layout/Header';  // ✅ lowercase 'l'
import Sidebar from './layout/Sidebar';  // ✅ lowercase 'l'
import { useAppContext } from '../context/AppContext';
import DashboardSection from './sections/DashboardSection';
import LeadsSection from './sections/LeadsSection';
import EmployeesSection from './sections/EmployeesSection';
import ClientsSection from './sections/ClientsSection';
import VirtualCardSection from './sections/VirtualCardSection';
import KnowledgeSection from './sections/KnowledgeSection';
import KycSection from './sections/KycSection';
import CibilSection from './sections/CibilSection';
import CommissionSection from './sections/CommissionSection';
import RemindersSection from './sections/RemindersSection';
import CalculatorSection from './sections/CalculatorSection';
import TeamSection from './sections/TeamSection';
import IssuesSection from './sections/IssuesSection';

const Dashboard = ({ setIsLoggedIn }) => {
  const context = useAppContext();
  const { 
    currentUser, setCurrentUser,
    leads, setLeads,
    employees, setEmployees,
    clients, setClients,
    knowledgeBase, setKnowledgeBase,
    reminders, setReminders,
    notifications, setNotifications,
    showAlert 
  } = context;

  const [currentSection, setCurrentSection] = useState('dashboardSection');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    const savedUser = localStorage.getItem('bankfinance_user');
    const savedTheme = localStorage.getItem('bankfinance_theme');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    if (savedTheme) {
      document.body.className = '';
      if (savedTheme !== 'default') {
        document.body.classList.add(`theme-${savedTheme}`);
      }
      setCurrentTheme(savedTheme);
    }
  }, [setCurrentUser]);

  const renderSection = () => {
    const props = {
      leads, setLeads,
      employees, setEmployees,
      clients, setClients,
      knowledgeBase, setKnowledgeBase,
      reminders, setReminders,
      notifications, setNotifications,
      currentUser,
      showAlert
    };

    switch(currentSection) {
      case 'dashboardSection': return <DashboardSection {...props} />;
      case 'leadsSection': return <LeadsSection {...props} />;
      case 'employeesSection': return <EmployeesSection {...props} />;
      case 'clientsSection': return <ClientsSection {...props} />;
      case 'virtualCardSection': return <VirtualCardSection {...props} />;
      case 'knowledgeSection': return <KnowledgeSection {...props} />;
      case 'kycSection': return <KycSection {...props} />;
      case 'cibilSection': return <CibilSection {...props} />;
      case 'commissionSection': return <CommissionSection {...props} />;
      case 'remindersSection': return <RemindersSection {...props} />;
      case 'calculatorSection': return <CalculatorSection {...props} />;
      case 'teamMembersSection': return <TeamSection {...props} />;
      case 'raiseIssueSection': 
      case 'myIssuesSection': return <IssuesSection {...props} section={currentSection} />;
      case 'myLeadsSection': return <LeadsSection {...props} personal={true} />;
      case 'myClientsSection': return <ClientsSection {...props} personal={true} />;
      default: return <DashboardSection {...props} />;
    }
  };

  return (
    <div className="dashboard">
      <Header 
        currentUser={currentUser}
        setCurrentSection={setCurrentSection} 
        setIsLoggedIn={setIsLoggedIn}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        notifications={notifications}
        showAlert={showAlert}
      />
      
      <div className="main-container">
        <Sidebar 
          currentSection={currentSection} 
          setCurrentSection={setCurrentSection}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          userType={currentUser?.type || 'admin'}
        />
        
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          {loading ? (
            <div className="section-loader">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            renderSection()
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;