// src/components/sections/CalculatorSection.js
import React, { useState } from 'react';
import './Sections.css';

const CalculatorSection = () => {
  const [amount, setAmount] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const calculateEMI = () => {
    const principal = amount;
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  };

  const result = calculateEMI();

  const formatCurrency = (value) => {
    return '₹' + value.toLocaleString('en-IN');
  };

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">Loan Calculator</h1>
      </div>
      
      <div className="content-card">
        <div className="form-group">
          <label>Loan Amount: <strong>{formatCurrency(amount)}</strong></label>
          <input 
            type="range" 
            min="100000" 
            max="10000000" 
            step="50000" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>₹1L</span>
            <span>₹1Cr</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>Interest Rate: <strong>{rate}%</strong></label>
          <input 
            type="range" 
            min="5" 
            max="20" 
            step="0.1" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>5%</span>
            <span>20%</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>Loan Tenure: <strong>{tenure} years</strong></label>
          <input 
            type="range" 
            min="1" 
            max="30" 
            step="1" 
            value={tenure} 
            onChange={(e) => setTenure(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>
        
        <div className="calculator-result">
          <div className="calculator-result-item">
            <p>Monthly EMI</p>
            <h3>{formatCurrency(result.emi)}</h3>
          </div>
          <div className="calculator-result-item">
            <p>Total Interest</p>
            <h3>{formatCurrency(result.totalInterest)}</h3>
          </div>
          <div className="calculator-result-item">
            <p>Total Payment</p>
            <h3>{formatCurrency(result.totalPayment)}</h3>
          </div>
          <div className="calculator-result-item">
            <p>Principal Amount</p>
            <h3>{formatCurrency(amount)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorSection;