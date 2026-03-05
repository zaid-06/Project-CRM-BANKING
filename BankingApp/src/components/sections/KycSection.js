// src/components/sections/KycSection.js
import React, { useState } from 'react';
import KycVideoModal from '../modals/KycVideoModal';
import { apiRequest } from '../../api';
import { useAppContext } from '../../context/AppContext';
import './Sections.css';

const KycSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [kycId, setKycId] = useState(null);
  const { showAlert } = useAppContext();

  const steps = [
    { icon: 'smile', title: 'Face Verification', desc: 'Camera me dekhein, smile karein' },
    { icon: 'id-card', title: 'Documents', desc: 'Aadhaar aur PAN dikhayein' },
    { icon: 'map-marker-alt', title: 'Location', desc: 'Location share karein' },
    { icon: 'key', title: 'OTP', desc: 'Mobile OTP enter karein' }
  ];

  const handleStartKyc = async () => {
    try {
      const res = await apiRequest('/kyc', {
        method: 'POST',
      });
      const kyc = res?.data || res;
      setKycId(kyc.id);
      setModalOpen(true);
    } catch (error) {
      if (showAlert) showAlert(error.message || 'Failed to start KYC', 'error');
    }
  };

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">KYC Guide</h1>
        <button className="btn btn-primary" onClick={handleStartKyc}>
          <i className="fas fa-video"></i> Start KYC
        </button>
      </div>
      
      <div className="content-card">
        <h3 className="card-title">Video KYC Steps</h3>
        {steps.map((step, index) => (
          <div key={index} className="instruction-item">
            <div className="instruction-icon">
              <i className={`fas fa-${step.icon}`}></i>
            </div>
            <div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <KycVideoModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        kycId={kycId}
      />
    </div>
  );
};

export default KycSection;