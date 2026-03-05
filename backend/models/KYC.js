const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');

const KYC = sequelize.define(
  "KYC",
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
        model: "users", // table name (lowercase recommended)
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "in-progress",
        "completed",
        "rejected"
      ),
      defaultValue: "pending",
    },

    faceVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    documentsVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    locationVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    otpVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    faceImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    aadharImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    panImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    location: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "kyc",
    timestamps: true,
  }
);


// Optional: Auto complete status hook
KYC.addHook("beforeUpdate", (kyc) => {
  if (
    kyc.faceVerified &&
    kyc.documentsVerified &&
    kyc.locationVerified &&
    kyc.otpVerified
  ) {
    kyc.status = "completed";
    kyc.completedAt = new Date();
  }
});

module.exports = KYC;