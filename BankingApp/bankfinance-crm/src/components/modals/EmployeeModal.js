// src/components/modals/EmployeeModal.js
import React, { useState, useEffect } from 'react';
import './Modals.css';

const EmployeeModal = ({ isOpen, onClose, onSave, employee }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    password: '',
    status: 'active'
  });

  useEffect(() => {
    if (employee) {
      // Editing existing employee: do not show or change password here
      setFormData({
        name: employee.name || '',
        role: employee.role || '',
        department: employee.department || '',
        email: employee.email || '',
        phone: employee.phone || '',
        password: '',
        status: employee.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        password: '',
        status: 'active'
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill all required fields');
      return;
    }

    // Require password only when creating a new employee
    if (!employee && !formData.password) {
      alert('Please enter a password for the new employee');
      return;
    }

    const payload = { ...formData };
    if (employee) {
      // On edit, omit empty password so backend doesn't change it
      if (!payload.password) {
        delete payload.password;
      }
    }

    if (formData.name && formData.email && formData.phone) {
      onSave(payload);
    } else {
      alert('Please fill all required fields');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
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
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role *</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Loan Officer"
                  required
                />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., Sales"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="employee@company.com"
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
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            {!employee && (
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Set login password"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {employee ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;