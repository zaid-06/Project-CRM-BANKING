const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');

const Issue = sequelize.define(
  "Issue",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      defaultValue: "medium",
    },

    status: {
      type: DataTypes.ENUM("open", "in-progress", "resolved", "closed"),
      defaultValue: "open",
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
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

    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "issues",
    timestamps: true,
  }
);


// Auto set resolvedAt when status becomes resolved
Issue.addHook("beforeUpdate", (issue) => {
  if (issue.changed("status") && issue.status === "resolved") {
    issue.resolvedAt = new Date();
  }
});

module.exports = Issue;