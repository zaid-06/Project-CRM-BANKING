// src/components/sections/TeamSection.js
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Sections.css';

const TeamSection = () => {
  const { employees } = useAppContext();

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">My Team</h1>
      </div>
      
      <div className="content-card">
        <div className="table-responsive">
          <table className="data-table">
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
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.department}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td><span className="badge badge-success">{emp.status}</span></td>
                  <td className="action-buttons">
                    <button className="action-btn view"><i className="fas fa-eye"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;