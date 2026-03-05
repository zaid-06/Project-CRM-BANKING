// src/components/sections/ClientsSection.js
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import ClientModal from '../modals/ClientModal'; // ✅ Import Client Modal
import { apiRequest } from '../../api';
import './Sections.css';

const ClientsSection = ({ personal = false }) => {
  const { clients, setClients, showAlert } = useAppContext();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/clients');
        setClients(data || []);
      } catch (error) {
        if (showAlert) showAlert(error.message || 'Failed to load clients', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapLoanTypeToLabel = (loanType) => {
    switch (loanType) {
      case 'home_loan': return 'Home Loan';
      case 'personal_loan': return 'Personal Loan';
      case 'business_loan': return 'Business Loan';
      case 'car_loan': return 'Car Loan';
      case 'gold_loan': return 'Gold Loan';
      default: return loanType || 'N/A';
    }
  };

  // Handle Add Client
  const handleAddClick = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  // Handle Edit Client
  const handleEditClick = (client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  // Handle Save Client (Add or Edit)
  const handleSaveClient = async (clientData) => {
    try {
      setLoading(true);

      const payload = {
        name: clientData.name,
        phone: clientData.phone,
        email: clientData.email,
        address: clientData.address,
        status: clientData.status === 'Active' ? 'active' : 'inactive',
      };

      if (editingClient && editingClient.id) {
        const res = await apiRequest(`/clients/${editingClient.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        const updated = res?.data || res;
        setClients(clients.map(c => (c.id === updated.id ? updated : c)));
        if (showAlert) showAlert('Client updated successfully', 'success');
      } else {
        const res = await apiRequest('/clients', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const created = res?.data || res;
        setClients([created, ...clients]);
        if (showAlert) showAlert('Client added successfully', 'success');
      }

      setModalOpen(false);
      setEditingClient(null);
    } catch (error) {
      if (showAlert) showAlert(error.message || 'Failed to save client', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      setDeleteConfirm(null);
      return;
    }

    try {
      setLoading(true);
      await apiRequest(`/clients/${id}`, { method: 'DELETE' });
      const updatedClients = clients.filter(client => client.id !== id);
      setClients(updatedClients);

      if (showAlert) {
        showAlert('Client deleted successfully', 'success');
      }
    } catch (error) {
      if (showAlert) showAlert(error.message || 'Failed to delete client', 'error');
    } finally {
      setDeleteConfirm(null);
      setLoading(false);
    }
  };

  const handleView = (client) => {
    if (showAlert) {
      showAlert(`Viewing ${client.name} details`, 'info');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">{personal ? 'My Clients' : 'Clients'}</h1>
        {!personal && (
          <button 
            className="btn btn-success"
            onClick={handleAddClick}  // ✅ Opens modal instead of alert
          >
            <i className="fas fa-plus"></i> Add Client
          </button>
        )}
      </div>
      
      <div className="content-card">
        {loading && (
          <div className="section-loader">
            <div className="spinner"></div>
            <p>Loading clients...</p>
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
                <th>Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients && clients.length > 0 ? (
                clients.map(client => (
                  <tr key={client.id}>
                    <td>{client.name || 'N/A'}</td>
                    <td>{client.phone || 'N/A'}</td>
                    <td>{client.email || 'N/A'}</td>
                    <td>{mapLoanTypeToLabel(client.loanType)}</td>
                    <td>{client.amount || 'N/A'}</td>
                    <td>
                      <span className={`badge ${client.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                        {client.status || 'Active'}
                      </span>
                    </td>
                    <td>{client.since || 'N/A'}</td>
                    <td className="action-buttons">
                      {/* View Button */}
                      <button 
                        className="action-btn view" 
                        title="View Client"
                        onClick={() => handleView(client)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      
                      {/* Edit Button */}
                      <button 
                        className="action-btn edit" 
                        title="Edit Client"
                        onClick={() => handleEditClick(client)}  // ✅ Opens edit modal
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        className="action-btn delete" 
                        title="Delete Client"
                        onClick={() => handleDelete(client.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fas fa-users" style={{ fontSize: '2rem', color: '#999', marginBottom: '10px' }}></i>
                    <p>No clients found. Click "Add Client" to create one.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Modal for Add/Edit */}
      <ClientModal 
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        client={editingClient}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this client?</p>
            <div className="delete-confirm-actions">
              <button 
                className="btn btn-danger" 
                onClick={() => confirmDelete(deleteConfirm)}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsSection;