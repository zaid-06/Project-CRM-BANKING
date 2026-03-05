// src/components/sections/CommissionSection.js
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Sections.css';

const CommissionSection = () => {
  const { showAlert } = useAppContext();

  const commissionData = [
    { product: 'Home Loan', rate: '0.8%', min: '₹10L', max: '₹1Cr+' },
    { product: 'Personal Loan', rate: '1.5%', min: '₹50K', max: '₹25L' },
    { product: 'Business Loan', rate: '1.2%', min: '₹5L', max: '₹50L' },
    { product: 'Car Loan', rate: '1.0%', min: '₹3L', max: '₹20L' },
    { product: 'Gold Loan', rate: '0.5%', min: '₹50K', max: '₹10L' }
  ];

  const handleDownload = () => {
    showAlert('Commission structure downloaded', 'success');
  };

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">Commission Structure</h1>
        <button className="btn btn-success" onClick={handleDownload}>
          <i className="fas fa-download"></i> Download
        </button>
      </div>
      
      <div className="content-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Commission Rate</th>
                <th>Min Amount</th>
                <th>Max Amount</th>
              </tr>
            </thead>
            <tbody>
              {commissionData.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td><span className="badge badge-success">{item.rate}</span></td>
                  <td>{item.min}</td>
                  <td>{item.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommissionSection;