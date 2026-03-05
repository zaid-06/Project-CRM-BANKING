// src/components/sections/VirtualCardSection.js (Simple version without html2canvas)
import React, { useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import './VirtualCardSection.css';

const VirtualCardSection = () => {
  const { currentUser, showAlert } = useAppContext();
  const cardRef = useRef(null);

  const handleDownload = () => {
    // Simple alert for download
    if (showAlert) {
      showAlert('Download feature - Saving card as image', 'info');
    }
    
    // Create a simple text representation for download
    const cardData = `
      Virtual ID Card
      ------------------------
      Card Holder: ${currentUser?.name || 'Admin User'}
      Role: ${currentUser?.role || 'Administrator'}
      Email: ${currentUser?.email || 'admin@bankfinance.com'}
      Card Number: **** **** **** 4582
      Expires: 12/25
      Valid Till: December 2025
    `;
    
    // Create a blob and download as text file
    const blob = new Blob([cardData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `virtual-card-${currentUser?.name || 'user'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    if (showAlert) showAlert('Card details downloaded as text file', 'success');
  };

  const handlePrint = () => {
    // Create a print-friendly version
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #1a237e; text-align: center; margin-bottom: 30px;">Virtual ID Card</h2>
        
        <!-- Card Design -->
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="width: 45px; height: 35px; background: linear-gradient(135deg, #ffd700, #ffb347); border-radius: 8px;"></div>
            <div style="display: flex; gap: 5px;">
              <i class="fas fa-wifi" style="font-size: 1.2rem; opacity: 0.8;"></i>
              <span style="font-size: 0.8rem; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 20px;">PREMIUM</span>
            </div>
          </div>
          
          <div style="font-size: 1.5rem; letter-spacing: 4px; margin-bottom: 20px; font-family: 'Courier New', monospace; text-align: center;">
            **** **** **** 4582
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
              <div style="font-size: 0.7rem; opacity: 0.8; margin-bottom: 3px;">CARD HOLDER</div>
              <div style="font-size: 1.1rem; font-weight: 600;">${(currentUser?.name || 'ADMIN USER').toUpperCase()}</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; opacity: 0.8; margin-bottom: 3px;">EXPIRES</div>
              <div style="font-size: 1.1rem; font-weight: 600;">12/25</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 1.3rem; font-weight: 800; font-style: italic;">BANK<span style="font-weight: 300; font-size: 0.9rem; margin-left: 5px; opacity: 0.8;">FINANCE</span></div>
            <div style="display: flex; gap: 10px; font-size: 1.5rem;">
              <i class="fab fa-cc-visa"></i>
              <i class="fab fa-cc-mastercard"></i>
            </div>
          </div>
        </div>
        
        <!-- Card Details -->
        <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
          <h3 style="color: #1a237e; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0;">Card Information</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #666; width: 40%;">Card Holder:</td>
              <td style="padding: 12px 0; font-weight: 600; color: #1a237e;">${currentUser?.name || 'Admin User'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #666;">Role:</td>
              <td style="padding: 12px 0; font-weight: 600; color: #1a237e;">${currentUser?.role || 'Administrator'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #666;">Email:</td>
              <td style="padding: 12px 0; font-weight: 600; color: #1a237e;">${currentUser?.email || 'admin@bankfinance.com'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #666;">Card Number:</td>
              <td style="padding: 12px 0; font-weight: 600; color: #1a237e;">**** **** **** 4582</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #666;">Expires:</td>
              <td style="padding: 12px 0; font-weight: 600; color: #1a237e;">12/25</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666;">Valid Till:</td>
              <td style="padding: 12px 0; font-weight: 600; color: #1a237e;">December 2025</td>
            </tr>
          </table>
        </div>
        
        <!-- Security Note -->
        <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #e8f5e9; border-radius: 10px; margin-top: 20px; color: #2e7d32;">
          <i class="fas fa-shield-alt" style="font-size: 1.5rem;"></i>
          <span style="font-size: 0.9rem;">Your card information is securely stored and encrypted</span>
        </div>
        
        <p style="text-align: center; margin-top: 30px; color: #999; font-size: 0.8rem;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </p>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Virtual ID Card - ${currentUser?.name || 'User'}</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 30px; 
              background: #f5f5f5;
              margin: 0;
            }
            @media print {
              body { 
                padding: 0; 
                background: white;
              }
              .no-print { 
                display: none; 
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 12px 30px; background: #3f51b5; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; margin-right: 10px;">
              <i class="fas fa-print"></i> Print
            </button>
            <button onclick="window.close()" style="padding: 12px 30px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
              <i class="fas fa-times"></i> Close
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    if (showAlert) showAlert('Print window opened', 'info');
  };

  return (
    <div className="virtual-card-page">
      <div className="page-header">
        <h1 className="page-title">Virtual ID Card</h1>
        <div className="card-actions">
          <button className="btn-download" onClick={handleDownload}>
            <i className="fas fa-download"></i> Download
          </button>
          <button className="btn-print" onClick={handlePrint}>
            <i className="fas fa-print"></i> Print
          </button>
        </div>
      </div>
      
      {/* Premium Virtual Card Design */}
      <div className="card-showcase">
        <div className="credit-card" ref={cardRef}>
          <div className="card-inner">
            <div className="card-front">
              <div className="card-bg-pattern"></div>
              
              {/* Card Header */}
              <div className="card-header">
                <div className="card-chip">
                  <div className="chip-lines"></div>
                  <div className="chip-circle"></div>
                </div>
                <div className="card-type">
                  <i className="fas fa-wifi"></i>
                  <span>PREMIUM</span>
                </div>
              </div>
              
              {/* Card Number */}
              <div className="card-number-container">
                <div className="card-number-group">
                  <span className="card-digits">****</span>
                  <span className="card-digits">****</span>
                  <span className="card-digits">****</span>
                  <span className="card-digits">4582</span>
                </div>
              </div>
              
              {/* Card Details */}
              <div className="card-details-row">
                <div className="card-holder">
                  <span className="label">CARD HOLDER</span>
                  <span className="value">{(currentUser?.name || 'ADMIN USER').toUpperCase()}</span>
                </div>
                <div className="card-expiry">
                  <span className="label">EXPIRES</span>
                  <span className="value">12/25</span>
                </div>
              </div>
              
              {/* Card Footer */}
              <div className="card-footer">
                <div className="card-logo">BANK<span>FINANCE</span></div>
                <div className="card-network">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="card-glow"></div>
              <div className="card-shine"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Details Panel */}
      <div className="details-panel">
        <h3 className="panel-title">Card Information</h3>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">
              <i className="fas fa-user"></i> Card Holder
            </span>
            <span className="detail-value">{currentUser?.name || 'Admin User'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">
              <i className="fas fa-briefcase"></i> Role
            </span>
            <span className="detail-value">{currentUser?.role || 'Administrator'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">
              <i className="fas fa-envelope"></i> Email
            </span>
            <span className="detail-value">{currentUser?.email || 'admin@bankfinance.com'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">
              <i className="fas fa-calendar"></i> Valid Till
            </span>
            <span className="detail-value">December 2025</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">
              <i className="fas fa-id-card"></i> Card Type
            </span>
            <span className="detail-value">
              <span className="premium-badge">PREMIUM</span>
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">
              <i className="fas fa-globe"></i> Network
            </span>
            <span className="detail-value">Visa / Mastercard</span>
          </div>
        </div>
        
        <div className="security-note">
          <i className="fas fa-shield-alt"></i>
          <span>Your card information is securely stored and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default VirtualCardSection;