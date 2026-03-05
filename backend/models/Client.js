const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    loanType: {
      type: DataTypes.ENUM(
        "home_loan",
        "personal_loan",
        "business_loan",
        "car_loan",
        "gold_loan"
      ),
      defaultValue: "personal_loan",
    },

    amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 500000,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive", "pending"),
      defaultValue: "active",
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    panNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    aadharNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "clients",
    timestamps: true,
  }
);

module.exports = Client;