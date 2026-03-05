// src/components/sections/EmployeesSection.js
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import EmployeeModal from '../modals/EmployeeModal'; // ✅ Add Employee Modal
import { apiRequest } from '../../api';
import './Sections.css';

const EmployeesSection = () => {
  const { employees, setEmployees, showAlert } = useAppContext();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/users?onlyEmployees=true');
        setEmployees(data || []);
      } catch (error) {
        if (showAlert) showAlert(error.message || 'Failed to load employees', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Add Employee
  const handleAddClick = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  // Handle Edit Employee
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  // Handle Save Employee (Add or Edit)
  const handleSaveEmployee = async (employeeData) => {
    try {
      setLoading(true);
      if (editingEmployee) {
        const res = await apiRequest(`/users/${editingEmployee.id}`, {
          method: 'PUT',
          body: JSON.stringify(employeeData),
        });
        const updated = res?.data || res;
        const updatedEmployees = employees.map(emp =>
          emp.id === updated.id ? updated : emp
        );
        setEmployees(updatedEmployees);
        if (showAlert) showAlert('Employee updated successfully', 'success');
      } else {
        const res = await apiRequest('/users', {
          method: 'POST',
          body: JSON.stringify(employeeData),
        });
        const created = res?.data || res;
        setEmployees([created, ...employees]);
        if (showAlert) showAlert('Employee added successfully', 'success');
      }
      setModalOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      if (showAlert) showAlert(error.message || 'Failed to save employee', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      setDeleteConfirm(null);
      return;
    }

    try {
      setLoading(true);
      // Soft-delete employee: mark user as inactive
      const res = await apiRequest(`/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'inactive' }),
      });

      // Remove from current list so it disappears immediately
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(updatedEmployees);
      
      if (showAlert) {
        showAlert('Employee deleted successfully', 'success');
      }
    } catch (error) {
      if (showAlert) showAlert(error.message || 'Failed to delete employee', 'error');
    } finally {
      setDeleteConfirm(null);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <button 
          className="btn btn-success" 
          onClick={handleAddClick}  // ✅ Opens modal instead of alert
        >
          <i className="fas fa-plus"></i> Add Employee
        </button>
      </div>
      
      <div className="content-card">
        {loading && (
          <div className="section-loader">
            <div className="spinner"></div>
            <p>Loading employees...</p>
          </div>
        )}
        <div className="table-responsive">
          <table className="data-table employees-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees && employees.length > 0 ? (
                employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.name || 'N/A'}</td>
                    <td>{emp.role || 'N/A'}</td>
                    <td>{emp.department || 'N/A'}</td>
                    <td>{emp.email || 'N/A'}</td>
                    <td>{emp.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${emp.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                        {emp.status || 'active'}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button 
                        className="action-btn view" 
                        title="View Employee"
                        onClick={() => {
                          if (showAlert) {
                            showAlert(`Viewing ${emp.name} details`, 'info');
                          }
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      
                      <button 
                        className="action-btn edit" 
                        title="Edit Employee"
                        onClick={() => handleEditClick(emp)}  // ✅ Opens edit modal
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      
                      <button 
                        className="action-btn delete" 
                        title="Delete Employee"
                        onClick={() => handleDelete(emp.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fas fa-users" style={{ fontSize: '2rem', color: '#999', marginBottom: '10px' }}></i>
                    <p>No employees found. Click "Add Employee" to create one.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Modal for Add/Edit */}
      <EmployeeModal 
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this employee?</p>
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

export default EmployeesSection;