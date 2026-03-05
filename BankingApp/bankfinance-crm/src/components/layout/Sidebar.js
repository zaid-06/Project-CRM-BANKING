// src/components/layout/Sidebar.js
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ 
  currentSection, setCurrentSection, mobileOpen, setMobileOpen,
  sidebarCollapsed, setSidebarCollapsed, userType
}) => {
  const getMenuItems = () => {
    const items = {
      admin: [
        { title: 'Dashboard', icon: 'fas fa-tachometer-alt', section: 'dashboardSection' },
        { title: 'Leads', icon: 'fas fa-user-friends', section: 'leadsSection' },
        { title: 'Employees', icon: 'fas fa-users', section: 'employeesSection' },
        { title: 'Clients', icon: 'fas fa-file-invoice', section: 'clientsSection' },
        { title: 'Virtual Card', icon: 'fas fa-id-card', section: 'virtualCardSection' },
        { title: 'Knowledge Base', icon: 'fas fa-book', section: 'knowledgeSection' },
        { title: 'KYC Guide', icon: 'fas fa-video', section: 'kycSection' },
        { title: 'CIBIL Check', icon: 'fas fa-chart-line', section: 'cibilSection' },
        { title: 'Commission', icon: 'fas fa-percentage', section: 'commissionSection' },
        { title: 'Reminders', icon: 'fas fa-bell', section: 'remindersSection' }
      ],
      manager: [
        { title: 'Dashboard', icon: 'fas fa-tachometer-alt', section: 'dashboardSection' },
        { title: 'Team Leads', icon: 'fas fa-user-friends', section: 'leadsSection' },
        { title: 'Team', icon: 'fas fa-users', section: 'teamMembersSection' },
        { title: 'Virtual Card', icon: 'fas fa-id-card', section: 'virtualCardSection' },
        { title: 'Knowledge', icon: 'fas fa-book', section: 'knowledgeSection' },
        { title: 'KYC', icon: 'fas fa-video', section: 'kycSection' },
        { title: 'Commission', icon: 'fas fa-percentage', section: 'commissionSection' },
        { title: 'Reminders', icon: 'fas fa-bell', section: 'remindersSection' }
      ],
      staff: [
        { title: 'Dashboard', icon: 'fas fa-tachometer-alt', section: 'dashboardSection' },
        { title: 'My Leads', icon: 'fas fa-user-friends', section: 'myLeadsSection' },
        { title: 'My Clients', icon: 'fas fa-file-invoice', section: 'myClientsSection' },
        { title: 'My Card', icon: 'fas fa-id-card', section: 'virtualCardSection' },
        { title: 'Calculator', icon: 'fas fa-calculator', section: 'calculatorSection' },
        { title: 'Knowledge', icon: 'fas fa-book', section: 'knowledgeSection' },
        { title: 'KYC', icon: 'fas fa-video', section: 'kycSection' },
        { title: 'CIBIL', icon: 'fas fa-chart-line', section: 'cibilSection' },
        { title: 'Commission', icon: 'fas fa-percentage', section: 'commissionSection' },
        { title: 'Reminders', icon: 'fas fa-bell', section: 'remindersSection' }
      ],
      franchise: [
        { title: 'Dashboard', icon: 'fas fa-tachometer-alt', section: 'dashboardSection' },
        { title: 'Raise Issue', icon: 'fas fa-exclamation-triangle', section: 'raiseIssueSection' },
        { title: 'My Issues', icon: 'fas fa-list', section: 'myIssuesSection' },
        { title: 'Virtual Card', icon: 'fas fa-id-card', section: 'virtualCardSection' },
        { title: 'Knowledge', icon: 'fas fa-book', section: 'knowledgeSection' },
        { title: 'Commission', icon: 'fas fa-percentage', section: 'commissionSection' }
      ]
    };
    return items[userType] || items.admin;
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    if (window.innerWidth <= 768) {
      setMobileOpen(false);
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        <i className={`fas fa-chevron-${sidebarCollapsed ? 'right' : 'left'}`}></i>
      </div>
      <ul className="nav-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="nav-item">
            <a
              href="#"
              className={`nav-link ${currentSection === item.section ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleSectionChange(item.section);
              }}
            >
              <i className={item.icon}></i>
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;