// src/components/sections/IssuesSection.js
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Sections.css';

const IssuesSection = ({ section }) => {
  const { showAlert } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const isRaiseIssue = section === 'raiseIssueSection';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      showAlert('Please enter title', 'error');
      return;
    }
    showAlert('Issue submitted successfully', 'success');
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  if (isRaiseIssue) {
    return (
      <div className="section-container">
        <div className="page-header">
          <h1 className="page-title">Raise Issue</h1>
        </div>
        
        <div className="content-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                className="form-control" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter issue title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                className="form-control" 
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue..."
              ></textarea>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select 
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Submit Issue</button>
          </form>
        </div>
      </div>
    );
  }

  // My Issues Section
  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">My Issues</h1>
      </div>
      
      <div className="content-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#001</td>
                <td>System Access</td>
                <td>Unable to access loan portal</td>
                <td><span className="badge badge-danger">High</span></td>
                <td><span className="badge badge-warning">In Progress</span></td>
                <td className="action-buttons">
                  <button className="action-btn view"><i className="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr>
                <td>#002</td>
                <td>Document Upload</td>
                <td>Error uploading KYC documents</td>
                <td><span className="badge badge-warning">Medium</span></td>
                <td><span className="badge badge-info">Open</span></td>
                <td className="action-buttons">
                  <button className="action-btn view"><i className="fas fa-eye"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IssuesSection;