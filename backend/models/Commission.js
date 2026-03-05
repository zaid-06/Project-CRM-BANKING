const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');
const Commission = sequelize.define(
  "Commission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },

    commissionAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "commissions",
    timestamps: true,
  }
);

module.exports = Commission;