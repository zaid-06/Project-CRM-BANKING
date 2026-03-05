const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');
const CIBIL = sequelize.define(
  "CIBIL",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 300,
        max: 900,
      },
    },

    reportDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    creditHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    totalAccounts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    activeAccounts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    settledAccounts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    delinquentAccounts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    inquiries: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "cibil",
    timestamps: true,
  }
);

module.exports = CIBIL;