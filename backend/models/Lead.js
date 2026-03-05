const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  loanType: {
    type: DataTypes.ENUM('Home Loan', 'Personal Loan', 'Business Loan', 'Car Loan', 'Gold Loan'),
    defaultValue: 'Personal Loan'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 500000
  },
  status: {
    type: DataTypes.ENUM('New', 'Contacted', 'Follow-up', 'Converted', 'Rejected'),
    defaultValue: 'New'
  },
  followup: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Lead;
