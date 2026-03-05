// src/components/modals/CibilModal.js
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Modals.css';

const CibilModal = ({ isOpen, onClose }) => {
  const [aadharUploaded, setAadharUploaded] = useState(false);
  const [panUploaded, setPanUploaded] = useState(false);
  const [score, setScore] = useState(750);
  const { showAlert } = useAppContext();

  if (!isOpen) return null;

  const handleFileUpload = (type) => {
    showAlert(`${type} uploaded`, 'success');
    if (type === 'Aadhar') setAadharUploaded(true);
    if (type === 'PAN') setPanUploaded(true);
  };

  const checkScore = () => {
    if (!aadharUploaded || !panUploaded) {
      showAlert('Upload both documents first', 'warning');
      return;
    }
    setScore(Math.floor(Math.random() * (850 - 600 + 1) + 600));
    showAlert('CIBIL score fetched', 'success');
  };

  const getScoreColor = () => {
    if (score < 600) return 'var(--danger-color)';
    if (score < 700) return 'var(--warning-color)';
    if (score < 750) return '#ffc107';
    return 'var(--success-color)';
  };

  const getPointerPosition = () => {
    return ((score - 300) / 600) * 100 + '%';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">CIBIL Score Check</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="upload-area" onClick={() => document.getElementById('cibilAadhar').click()}>
            <i className="fas fa-cloud-upload-alt"></i>
            <h3>Upload Aadhar Card</h3>
            {aadharUploaded && <p style={{ color: 'var(--success-color)' }}>✓ Uploaded</p>}
            <input 
              type="file" 
              id="cibilAadhar" 
              style={{ display: 'none' }} 
              accept="image/*,application/pdf"
              onChange={() => handleFileUpload('Aadhar')}
            />
          </div>
          
          <div className="upload-area" onClick={() => document.getElementById('cibilPan').click()}>
            <i className="fas fa-cloud-upload-alt"></i>
            <h3>Upload PAN Card</h3>
            {panUploaded && <p style={{ color: 'var(--success-color)' }}>✓ Uploaded</p>}
            <input 
              type="file" 
              id="cibilPan" 
              style={{ display: 'none' }} 
              accept="image/*,application/pdf"
              onChange={() => handleFileUpload('PAN')}
            />
          </div>
          
          <div className="cibil-score-display" style={{ color: getScoreColor() }}>
            {score}
          </div>
          
          <div className="cibil-meter">
            <div className="cibil-pointer" style={{ left: getPointerPosition() }}></div>
          </div>
          <div className="cibil-range">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={checkScore}>
            Check Score
          </button>
        </div>
      </div>
    </div>
  );
};

export default CibilModal;