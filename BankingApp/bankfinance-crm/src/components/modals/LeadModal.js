// src/components/modals/LeadModal.js
import React, { useState, useEffect } from 'react';
import './Modals.css';

const LeadModal = ({ isOpen, onClose, onSave, lead }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    loanType: 'Home Loan',
    amount: '₹5,00,000',
    status: 'New'
  });

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        loanType: 'Home Loan',
        amount: '₹5,00,000',
        status: 'New'
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.email) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{lead ? 'Edit Lead' : 'Add Lead'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Loan Type</label>
                <select
                  name="loanType"
                  className="form-control"
                  value={formData.loanType}
                  onChange={handleChange}
                >
                  <option>Home Loan</option>
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                  <option>Car Loan</option>
                  <option>Gold Loan</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="text"
                  name="amount"
                  className="form-control"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Follow-up</option>
                <option>Converted</option>
                <option>Rejected</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {lead ? 'Update Lead' : 'Save Lead'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;