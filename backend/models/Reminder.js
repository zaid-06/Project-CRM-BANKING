const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reminder = sequelize.define('Reminder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  client: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'missed'),
    defaultValue: 'pending'
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Reminder;
