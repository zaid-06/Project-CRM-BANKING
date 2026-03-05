// src/components/layout/Header.js
import React, { useState } from 'react';
import './Header.css';
import { apiRequest } from '../../api';

const Header = ({ 
  currentUser, setCurrentSection, setIsLoggedIn, 
  mobileOpen, setMobileOpen, currentTheme, setCurrentTheme,
  notifications, showAlert
}) => {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async (e) => {
    e?.preventDefault();
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Ignore logout errors; proceed with client-side cleanup
    } finally {
      localStorage.removeItem('bankfinance_user');
      setIsLoggedIn(false);
      if (showAlert) showAlert('Logged out successfully', 'success');
    }
  };

  const changeTheme = (theme) => {
    document.body.className = '';
    if (theme !== 'default') {
      document.body.classList.add(`theme-${theme}`);
    }
    setCurrentTheme(theme);
    localStorage.setItem('bankfinance_theme', theme);
    setThemeMenuOpen(false);
    if (showAlert) showAlert('Theme changed successfully', 'success');
  };

  const themeNames = {
    'default': 'Corporate',
    'finance': 'Green',
    'modern': 'Purple',
    'dark': 'Dark'
  };

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-left">
          <div className="mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            <i className="fas fa-bars"></i>
          </div>
          <div className="logo" onClick={() => setCurrentSection('dashboardSection')}>
            <i className="fas fa-university"></i>
            <span>BankFinance CRM</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="theme-selector">
            <button className="theme-btn" onClick={() => setThemeMenuOpen(!themeMenuOpen)}>
              <i className="fas fa-palette"></i>
              <span className="theme-name">{themeNames[currentTheme]}</span>
              <i className="fas fa-chevron-down"></i>
            </button>
            {themeMenuOpen && (
              <div className="theme-options">
                <div className="theme-option" onClick={() => changeTheme('default')}>
                  <span className="theme-color default"></span>
                  <span>Corporate Blue</span>
                </div>
                <div className="theme-option" onClick={() => changeTheme('finance')}>
                  <span className="theme-color finance"></span>
                  <span>Green Finance</span>
                </div>
                <div className="theme-option" onClick={() => changeTheme('modern')}>
                  <span className="theme-color modern"></span>
                  <span>Purple Modern</span>
                </div>
                <div className="theme-option" onClick={() => changeTheme('dark')}>
                  <span className="theme-color dark"></span>
                  <span>Dark Pro</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="user-info">
            <div className="notification-icon" onClick={() => showAlert && showAlert(`${unreadCount} new notifications`, 'info')}>
              <i className="far fa-bell"></i>
              {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
            </div>
            
            <div className="user-profile" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
              <div className="user-avatar">{currentUser?.avatar || 'A'}</div>
              <div className="user-details">
                <div className="user-name">{currentUser?.name || 'Admin User'}</div>
                <div className="user-role">{currentUser?.role || 'Administrator'}</div>
              </div>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </div>

      {userDropdownOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-avatar">{currentUser?.avatar || 'A'}</div>
            <div className="dropdown-info">
              <h4>{currentUser?.name || 'Admin User'}</h4>
              <p>{currentUser?.role || 'Administrator'}</p>
              <small>{currentUser?.email || 'admin@bankfinance.com'}</small>
            </div>
          </div>
          <ul className="dropdown-menu">
            <li><a href="#" onClick={() => { setCurrentSection('dashboardSection'); setUserDropdownOpen(false); }}><i className="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li><a href="#" onClick={() => { setCurrentSection('virtualCardSection'); setUserDropdownOpen(false); }}><i className="fas fa-id-card"></i> My Virtual Card</a></li>
            <li><a href="#" onClick={() => { setCurrentSection('remindersSection'); setUserDropdownOpen(false); }}><i className="fas fa-bell"></i> My Reminders</a></li>
            <li><a href="#" onClick={() => { setCurrentSection('kycSection'); setUserDropdownOpen(false); }}><i className="fas fa-video"></i> KYC Status</a></li>
            <li><a href="#" onClick={() => { setCurrentSection('commissionSection'); setUserDropdownOpen(false); }}><i className="fas fa-percentage"></i> Commission</a></li>
            <li className="logout"><a href="#" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;