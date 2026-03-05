// src/components/sections/RemindersSection.js
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import ReminderModal from '../modals/ReminderModal';
import './Sections.css';

const RemindersSection = () => {
  const { reminders, setReminders, showAlert } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Delete this reminder?')) {
      setReminders(reminders.filter(r => r.id !== id));
      showAlert('Reminder deleted', 'success');
    }
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setModalOpen(true);
  };

  const handleSave = (reminderData) => {
    if (editingReminder) {
      setReminders(reminders.map(r => r.id === editingReminder.id ? { ...r, ...reminderData } : r));
      showAlert('Reminder updated', 'success');
    } else {
      const newReminder = {
        id: reminders.length + 1,
        ...reminderData,
        status: 'pending'
      };
      setReminders([...reminders, newReminder]);
      showAlert('Reminder added', 'success');
    }
    setModalOpen(false);
    setEditingReminder(null);
  };

  return (
    <div className="section-container">
      <div className="page-header">
        <h1 className="page-title">Reminders</h1>
        <button className="btn btn-primary" onClick={() => {
          setEditingReminder(null);
          setModalOpen(true);
        }}>
          <i className="fas fa-plus"></i> Add Reminder
        </button>
      </div>
      
      <div className="reminder-list">
        {reminders.map(reminder => (
          <div key={reminder.id} className="reminder-item">
            <div className="reminder-info">
              <h4>{reminder.client}</h4>
              <p><i className="far fa-calendar"></i> {reminder.date} at {reminder.time}</p>
              <p><i className="far fa-sticky-note"></i> {reminder.notes}</p>
            </div>
            <div>
              <span className={`reminder-status ${reminder.status}`}>{reminder.status}</span>
              <div className="action-buttons" style={{ marginTop: '10px' }}>
                <button className="action-btn edit" onClick={() => handleEdit(reminder)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-btn delete" onClick={() => handleDelete(reminder.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
        {reminders.length === 0 && (
          <div className="content-card" style={{ textAlign: 'center', padding: '40px' }}>
            <i className="fas fa-bell" style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '15px' }}></i>
            <p>No reminders yet</p>
          </div>
        )}
      </div>

      <ReminderModal 
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingReminder(null);
        }}
        onSave={handleSave}
        reminder={editingReminder}
      />
    </div>
  );
};

export default RemindersSection;