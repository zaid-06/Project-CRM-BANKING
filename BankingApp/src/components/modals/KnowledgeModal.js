// src/components/modals/KnowledgeModal.js
import React from 'react';
import './Modals.css';

const KnowledgeModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{item.title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="knowledge-detail">
            <div className="knowledge-icon-large">
              <i className={`fas fa-${item.type === 'pdf' ? 'file-pdf' : item.type === 'video' ? 'video' : 'file-alt'}`}></i>
            </div>
            <p className="knowledge-content">{item.content}</p>
            <div className="knowledge-meta">
              <strong>Type:</strong> {item.type.toUpperCase()}
            </div>
            <div className="knowledge-tags">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="knowledge-tag">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeModal;