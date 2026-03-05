// src/components/sections/DashboardSection.js
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext'; // ✅ Import top level
import { apiRequest } from '../../api';
import './Sections.css';

const DashboardSection = () => {
  // ✅ Hooks hamesha top level pe - condition ke bahar
  const context = useAppContext();
  
  // Safely access context with defaults
  const clients = context?.clients || [];
  const employees = context?.employees || [];
  
  const [recentLeads, setRecentLeads] = useState([]);
  
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalClients: 0,
    totalEmployees: 0,
    todayReminders: 0,
    kycPending: 0,
    kycCompleted: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  
  const leadChartRef = useRef(null);
  const monthlyChartRef = useRef(null);
  const chartInstances = useRef({});

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const data = await apiRequest('/dashboard');
      setStats({
        totalLeads: data.totalLeads || 0,
        totalClients: data.totalClients || 0,
        totalEmployees: data.totalEmployees || 0,
        todayReminders: data.todayReminders || 0,
        kycPending: data.kycPending || 0,
        kycCompleted: data.kycCompleted || 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    // Initial stats load from backend
    loadStats();
    // Load recent leads (max 3) for current user/admin
    const loadRecentLeads = async () => {
      try {
        const data = await apiRequest('/leads?limit=3');
        setRecentLeads(data || []);
      } catch (error) {
        console.error('Failed to load recent leads', error);
      }
    };
    loadRecentLeads();
  }, []);

  useEffect(() => {
    // Load Chart.js if not available
    if (typeof window.Chart === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.onload = initializeCharts;
      document.head.appendChild(script);
    } else {
      initializeCharts();
    }

    // Cleanup function
    return () => {
      if (chartInstances.current.leadStatus) {
        chartInstances.current.leadStatus.destroy();
      }
      if (chartInstances.current.monthly) {
        chartInstances.current.monthly.destroy();
      }
    };
  }, [recentLeads]); // Re-run when recentLeads change (for charts only)

  const initializeCharts = () => {
    if (!window.Chart) return;

    // Destroy existing charts
    if (chartInstances.current.leadStatus) {
      chartInstances.current.leadStatus.destroy();
    }
    if (chartInstances.current.monthly) {
      chartInstances.current.monthly.destroy();
    }

    // Lead Status Chart
    if (leadChartRef.current) {
      const statusCounts = {
        'New': recentLeads.filter(l => l.status === 'New').length,
        'Contacted': recentLeads.filter(l => l.status === 'Contacted').length,
        'Follow-up': recentLeads.filter(l => l.status === 'Follow-up').length,
        'Converted': recentLeads.filter(l => l.status === 'Converted').length,
        'Rejected': recentLeads.filter(l => l.status === 'Rejected').length
      };

      chartInstances.current.leadStatus = new window.Chart(leadChartRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statusCounts),
          datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: ['#2196f3', '#ff9800', '#ffc107', '#4caf50', '#f44336'],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: { 
              backgroundColor: 'white',
              titleColor: '#333',
              bodyColor: '#666'
            }
          }
        }
      });
    }

    // Monthly Performance Chart
    if (monthlyChartRef.current) {
      chartInstances.current.monthly = new window.Chart(monthlyChartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Leads',
              data: [12, 19, 15, 17, 14, 18],
              borderColor: '#2196f3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#2196f3',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4
            },
            {
              label: 'Conversions',
              data: [8, 12, 10, 13, 9, 14],
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#4caf50',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { 
                usePointStyle: true, 
                boxWidth: 6,
                color: '#333'
              }
            }
          },
          scales: {
            y: { 
              beginAtZero: true, 
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: { color: '#666' }
            },
            x: { 
              grid: { display: false },
              ticks: { color: '#666' }
            }
          }
        }
      });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'New': return 'badge-info';
      case 'Contacted': return 'badge-warning';
      case 'Follow-up': return 'badge-warning';
      case 'Converted': return 'badge-success';
      case 'Rejected': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <button 
          className="btn btn-primary" 
          onClick={loadStats}
          disabled={loadingStats}
        >
          <i className="fas fa-sync-alt"></i> {loadingStats ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon leads"><i className="fas fa-user-friends"></i></div>
          <div className="stat-info">
            <h3>{stats.totalLeads}</h3>
            <p>Total Leads</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon clients"><i className="fas fa-user-tie"></i></div>
          <div className="stat-info">
            <h3>{stats.totalClients}</h3>
            <p>Clients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon employees"><i className="fas fa-users"></i></div>
          <div className="stat-info">
            <h3>{stats.totalEmployees}</h3>
            <p>Employees</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon payout"><i className="fas fa-bell"></i></div>
          <div className="stat-info">
            <h3>{stats.todayReminders}</h3>
            <p>Today&apos;s Reminders</p>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Lead Status Distribution</h3>
          </div>
          <div className="chart-container">
            <canvas ref={leadChartRef}></canvas>
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Performance</h3>
          </div>
          <div className="chart-container">
            <canvas ref={monthlyChartRef}></canvas>
          </div>
        </div>
      </div>
      
      {/* Recent Leads */}
      <div className="content-card">
        <div className="card-header">
          <h2 className="card-title">Recent Leads</h2>
          <button className="btn btn-primary btn-sm">View All</button>
        </div>
        
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Loan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map(lead => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.loanType}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button className="action-btn view">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit">
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;