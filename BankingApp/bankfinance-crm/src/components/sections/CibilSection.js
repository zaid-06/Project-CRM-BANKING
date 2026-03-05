// src/components/sections/CibilSection.js
import React, { useState } from 'react';
import CibilModal from '../modals/CibilModal';
import './Sections.css';

const CibilSection = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">CIBIL Check</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <i className="fas fa-search"></i> Check Now
        </button>
      </div>
      
      <div className="content-card">
        <h3>What is CIBIL Score?</h3>
        <p>CIBIL score is a 3-digit number (300-900) that represents your creditworthiness. A higher score increases your chances of loan approval.</p>
        
        <div className="cibil-meter">
          <div className="cibil-pointer" style={{ left: '75%' }}></div>
        </div>
        <div className="cibil-range">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
        
        <div className="cibil-score-display">750</div>
        <p style={{ textAlign: 'center' }}>Your score is <strong>Good</strong>!</p>
      </div>

      <CibilModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default CibilSection;