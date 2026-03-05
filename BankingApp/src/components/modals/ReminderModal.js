// src/components/modals/ReminderModal.js
import React, { useState, useEffect } from 'react';
import './Modals.css';

const ReminderModal = ({ isOpen, onClose, onSave, reminder }) => {
  const [formData, setFormData] = useState({
    client: '',
    date: '',
    time: '10:00',
    notes: ''
  });

  useEffect(() => {
    if (reminder) {
      setFormData(reminder);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        client: '',
        date: today,
        time: '10:00',
        notes: ''
      });
    }
  }, [reminder]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.client && formData.date && formData.time) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{reminder ? 'Edit Reminder' : 'Add Reminder'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Client Name *</label>
              <input
                type="text"
                name="client"
                className="form-control"
                value={formData.client}
                onChange={handleChange}
                placeholder="Enter client name"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="time"
                  className="form-control"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                className="form-control"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add notes..."
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {reminder ? 'Update Reminder' : 'Save Reminder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;