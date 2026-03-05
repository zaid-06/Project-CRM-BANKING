// src/components/modals/ClientModal.js
import React, { useState, useEffect } from 'react';
import './Modals.css';

const ClientModal = ({ isOpen, onClose, onSave, client }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    loanType: 'Home Loan',
    amount: '',
    status: 'Active',
    since: ''
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (client) {
      // Edit mode - populate with client data
      setFormData({
        name: client.name || '',
        phone: client.phone || '',
        email: client.email || '',
        loanType: client.loanType || 'Home Loan',
        amount: client.amount || '',
        status: client.status || 'Active',
        since: client.since || new Date().toISOString().split('T')[0]
      });
    } else {
      // Add mode - set default values
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        name: '',
        phone: '',
        email: '',
        loanType: 'Home Loan',
        amount: '₹5,00,000',
        status: 'Active',
        since: today
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!formData.amount.trim()) {
      newErrors.amount = 'Loan amount is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      loanType: 'Home Loan',
      amount: '',
      status: 'Active',
      since: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-user-tie" style={{ marginRight: '10px', color: '#3f51b5' }}></i>
            {client ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="form-group">
              <label>
                Full Name <span style={{ color: '#f44336' }}>*</span>
              </label>
              <div className="input-with-icon">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter client full name"
                />
              </div>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Phone and Email Row */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Phone Number <span style={{ color: '#f44336' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-phone-alt"></i>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control ${errors.phone ? 'error' : ''}`}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>
                  Email Address <span style={{ color: '#f44336' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="client@example.com"
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            {/* Loan Type and Amount Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Loan Type</label>
                <div className="input-with-icon">
                  <i className="fas fa-home"></i>
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
                    <option>Education Loan</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Loan Amount <span style={{ color: '#f44336' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-rupee-sign"></i>
                  <input
                    type="text"
                    name="amount"
                    className={`form-control ${errors.amount ? 'error' : ''}`}
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="₹5,00,000"
                  />
                </div>
                {errors.amount && <span className="error-message">{errors.amount}</span>}
              </div>
            </div>

            {/* Status and Since Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <div className="input-with-icon">
                  <i className="fas fa-circle" style={{ color: formData.status === 'Active' ? '#4caf50' : '#ff9800' }}></i>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending</option>
                    <option>Blocked</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Client Since</label>
                <div className="input-with-icon">
                  <i className="fas fa-calendar-alt"></i>
                  <input
                    type="date"
                    name="since"
                    className="form-control"
                    value={formData.since}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save"></i> 
                {client ? ' Update Client' : ' Add Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;