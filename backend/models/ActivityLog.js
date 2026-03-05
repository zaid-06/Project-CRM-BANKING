const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ActivityLog = sequelize.define("ActivityLog", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  userId: {
    type: DataTypes.INTEGER
  },

  action: {
    type: DataTypes.STRING(100)
  },

  module: {
    type: DataTypes.STRING(100)
  },

  description: {
    type: DataTypes.TEXT
  }

}, {
  timestamps: true
});

module.exports = ActivityLog;