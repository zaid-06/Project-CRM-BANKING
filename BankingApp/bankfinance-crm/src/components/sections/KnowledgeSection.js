// src/components/sections/KnowledgeSection.js
import React from 'react';
import './Sections.css';

// Simple component - bina kisi dependency ke
const KnowledgeSection = () => {
  // Sample data directly yahan define karo
  const knowledgeItems = [
    { 
      id: 1, 
      title: 'Loan Processing Guide', 
      type: 'pdf', 
      tags: ['loan', 'guide'], 
      content: 'Complete guide for loan processing and documentation.' 
    },
    { 
      id: 2, 
      title: 'KYC Verification Steps', 
      type: 'video', 
      tags: ['kyc', 'verification'], 
      content: 'Step-by-step video guide for KYC verification process.' 
    },
    { 
      id: 3, 
      title: 'CIBIL Score Explained', 
      type: 'text', 
      tags: ['cibil', 'credit'], 
      content: 'Understanding CIBIL score and how to improve it.' 
    }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'pdf': return 'file-pdf';
      case 'video': return 'video';
      default: return 'file-alt';
    }
  };

  const handleItemClick = (item) => {
    alert(`Opening: ${item.title}`);
  };

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">Knowledge Base</h1>
      </div>
      
      <div className="knowledge-grid">
        {knowledgeItems.map(item => (
          <div 
            key={item.id} 
            className="knowledge-item" 
            onClick={() => handleItemClick(item)}
          >
            <div className="knowledge-icon">
              <i className={`fas fa-${getIcon(item.type)}`}></i>
            </div>
            <h3 className="knowledge-title">{item.title}</h3>
            <p className="knowledge-description">
              {item.content.substring(0, 60)}...
            </p>
            <div className="knowledge-tags">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="knowledge-tag">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ Yeh line sabse important hai
export default KnowledgeSection;