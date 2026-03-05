// src/components/sections/LeadsSection.js (Complete Fixed Version)
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { apiRequest } from '../../api';
import LeadModal from '../modals/LeadModal';
import './Sections.css';

const LeadsSection = ({ personal = false }) => {
  // ✅ Hooks hamesha top level pe - condition ke andar nahi
  const context = useAppContext();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Safely access context data
  const leads = context?.leads || [];
  const setLeads = context?.setLeads || (() => {});
  const showAlert = context?.showAlert || ((msg) => console.log(msg));

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/leads');
        setLeads(data || []);
      } catch (error) {
        showAlert(error.message || 'Failed to load leads', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    const deleteLead = async () => {
      try {
        await apiRequest(`/leads/${id}`, { method: 'DELETE' });
        setLeads(leads.filter(l => l.id !== id));
        if (showAlert) showAlert('Lead deleted successfully', 'success');
      } catch (error) {
        showAlert(error.message || 'Failed to delete lead', 'error');
      }
    };

    deleteLead();
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

  const handleAddClick = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  const handleEditClick = (lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleSaveLead = async (formData) => {
    try {
      setLoading(true);

      // Map frontend fields to backend payload
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        loanType: formData.loanType,
        amount: typeof formData.amount === 'string'
          ? Number(formData.amount.replace(/[^\d.-]/g, '')) || 0
          : formData.amount,
        status: formData.status,
      };

      if (editingLead && editingLead.id) {
        const res = await apiRequest(`/leads/${editingLead.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        const updated = res?.data || res;
        setLeads(leads.map(l => (l.id === updated.id ? updated : l)));
        showAlert('Lead updated successfully', 'success');
      } else {
        const res = await apiRequest('/leads', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const created = res?.data || res;
        setLeads([created, ...leads]);
        showAlert('Lead added successfully', 'success');
      }

      setModalOpen(false);
      setEditingLead(null);
    } catch (error) {
      showAlert(error.message || 'Failed to save lead', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">{personal ? 'My Leads' : 'Leads Management'}</h1>
        <div className="header-actions">
          <button className="btn btn-success" onClick={handleAddClick}>
            <i className="fas fa-plus"></i> Add Lead
          </button>
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select 
            className="filter-select" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Converted">Converted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Search by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="content-card">
        {loading && (
          <div className="section-loader">
            <div className="spinner"></div>
            <p>Loading leads...</p>
          </div>
        )}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.email}</td>
                    <td>{lead.loanType}</td>
                    <td>{lead.amount}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button className="action-btn view">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditClick(lead)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDelete(lead.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fas fa-inbox" style={{ fontSize: '2rem', color: '#999' }}></i>
                    <p>No leads found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeadModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingLead(null); }}
        onSave={handleSaveLead}
        lead={editingLead}
      />
    </div>
  );
};

export default LeadsSection;