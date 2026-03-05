const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM("lead", "client", "issue", "reminder", "system"),
    defaultValue: "system"
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

}, {
  timestamps: true
});

module.exports = Notification;