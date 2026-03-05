// src/components/modals/DemoModal.js
import React from 'react';
import './Modals.css';

const DemoModal = ({ isOpen, onClose, lead }) => {
  if (!isOpen) return null;

  const handleDownload = (file) => {
    alert(`Downloading ${file}...`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Lead Demo - Sample Documents</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              className="form-control"
              value={lead?.name || 'Rahul Sharma'}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Loan Type</label>
            <input
              type="text"
              className="form-control"
              value={lead?.loanType || 'Home Loan'}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Sample Documents</label>
            <div className="document-list">
              <div className="document-item">
                <span><i className="fas fa-file-pdf" style={{ color: '#f44336' }}></i> KYC_Form.pdf</span>
                <button className="action-btn download" onClick={() => handleDownload('KYC_Form.pdf')}>
                  <i className="fas fa-download"></i>
                </button>
              </div>
              <div className="document-item">
                <span><i className="fas fa-file-image" style={{ color: '#ff9800' }}></i> Aadhar_Card.jpg</span>
                <button className="action-btn download" onClick={() => handleDownload('Aadhar_Card.jpg')}>
                  <i className="fas fa-download"></i>
                </button>
              </div>
              <div className="document-item">
                <span><i className="fas fa-file-alt" style={{ color: '#2196f3' }}></i> Income_Proof.pdf</span>
                <button className="action-btn download" onClick={() => handleDownload('Income_Proof.pdf')}>
                  <i className="fas fa-download"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={() => window.print()}>
              <i className="fas fa-print"></i> Print
            </button>
            <button className="btn btn-success" onClick={() => alert('Downloading all...')}>
              <i className="fas fa-download"></i> Download All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;